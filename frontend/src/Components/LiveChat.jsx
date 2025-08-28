import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, User, Send, Paperclip, Search, Filter, Clock, Check, CheckCheck, ArrowLeft, Users, Plus, X } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Card from './ui/Card';
import Input from './ui/Input';
import { useAuth } from '../contexts/AuthContext';

const LiveChat = () => {
  const { roomCode: urlRoomCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  console.log('🔍 LiveChat renderizado com parâmetros:', { urlRoomCode, pathname: location.pathname });
  
  const [partnerId, setPartnerId] = useState('');
  const chatSocketRef = useRef(null);
  const [wsMessages, setWsMessages] = useState([]);
  const { user } = useAuth();
  const [roomCode, setRoomCode] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('conversas');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    category: 'saude-mental',
    isPrivate: false,
    maxMembers: 100
  });

  // Arrays vazios para dados reais
  const psychologists = [];
  const groups = [];
  const conversations = [];

  // Auto-scroll para a última mensagem
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [wsMessages]);

  // Se há um código de sala na URL, usa ele automaticamente
  useEffect(() => {
    console.log('🔍 useEffect detectando código da sala:', { urlRoomCode, pathname: location.pathname });
    
    if (urlRoomCode) {
      console.log('🏠 Código da sala detectado na URL:', urlRoomCode);
      setPartnerId(urlRoomCode);
      setSelectedChat(urlRoomCode);
      setRoomCode(urlRoomCode);
      console.log('✅ Estado atualizado com código da sala:', urlRoomCode);
    } else {
      console.log('ℹ️ Nenhum código de sala na URL');
    }
  }, [urlRoomCode, location.pathname]);

  // Build stable room name from two IDs
  const getRoomName = useCallback(() => {
    const me = user?.uid;
    if (!me || !partnerId) return null;
    const [a, b] = [me, partnerId].sort();
    return `${a}_${b}`;
  }, [user?.uid, partnerId]);

  // Connect websocket whenever room changes
  useEffect(() => {
    const roomName = getRoomName();
    if (!roomName) return;

    console.log('🔌 Tentando conectar WebSocket para sala:', roomName);
    setConnectionStatus('connecting');

    // Conecta ao backend Django
    const connectToDjangoBackend = () => {
      try {
        const token = user?.idToken || localStorage.getItem('firebase_token');
        console.log('🔑 Token disponível:', !!token, 'User:', user?.uid);
        const wsUrl = `ws://localhost:8000/ws/chat/${roomName}/?token=${token}`;
        console.log(`🌐 Conectando ao backend Django: ${wsUrl}`);
        
        const chatSocket = new WebSocket(wsUrl);
        chatSocketRef.current = chatSocket;

        const connectionTimeout = setTimeout(() => {
          if (chatSocket.readyState === WebSocket.CONNECTING) {
            console.log('⏰ Timeout na conexão WebSocket');
            chatSocket.close();
            setConnectionStatus('error');
          }
        }, 5000);

        chatSocket.onopen = function(e) {
          clearTimeout(connectionTimeout);
          console.log('✅ WebSocket conectado com sucesso ao backend Django!');
          setConnectionStatus('connected');
          
          // Envia mensagem de teste para verificar a conexão
          chatSocket.send(JSON.stringify({
            type: 'ping',
            message: 'Teste de conexão'
          }));
        };

        chatSocket.onmessage = function(e) {
          console.log('📨 Mensagem recebida do backend:', e.data);
          try {
            const data = JSON.parse(e.data);
            
            // Diferentes tipos de mensagem
            switch (data.type) {
              case 'connection_established':
                console.log('✅ Conexão estabelecida:', data);
                break;

              case 'pong':
                console.log('🏓 Pong recebido - conexão ativa');
                break;

              case 'chat_message':
                console.log('💬 Mensagem de chat recebida:', data);
                console.log('🆔 É própria mensagem?', data.is_own);
                
                // CRÍTICO: Só processar mensagens de OUTROS usuários
                if (!data.is_own) {
                  console.log('✅ Adicionando mensagem de outro usuário');
                  const newMessage = {
                    id: Date.now() + Math.random(),
                    message: data.message,
                    isOwn: false,
                    user: data.user_name || 'Usuário',
                    user_id: data.user_id,
                    user_avatar: data.user_avatar,
                    time: new Date(data.timestamp).toLocaleTimeString(),
                    status: 'delivered',
                    timestamp: data.timestamp
                  };
                  
                  setWsMessages((prev) => {
                    // Evitar mensagens duplicadas
                    const exists = prev.some(msg => 
                      msg.message === newMessage.message && 
                      msg.user_id === newMessage.user_id &&
                      Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000
                    );
                    
                    if (exists) {
                      console.log('⏭️ Mensagem duplicada ignorada');
                      return prev;
                    }
                    
                    console.log('📝 Adicionando nova mensagem:', newMessage);
                    return [...prev, newMessage];
                  });
                } else {
                  console.log('⏭️ Mensagem própria ignorada (já foi adicionada localmente)');
                }
                break;

              case 'message_sent':
                console.log('✅ Confirmação: Mensagem enviada com sucesso!');
                // Atualizar status da mensagem para 'delivered'
                setWsMessages(prev => 
                  prev.map(msg => 
                    msg.isOwn && msg.status === 'sending' && msg.message === data.message
                      ? { ...msg, status: 'delivered' }
                      : msg
                  )
                );
                break;

              case 'error':
                console.error('❌ Erro do servidor:', data.message);
                break;

              default:
                console.log('⚠️ Tipo de mensagem desconhecido:', data.type);
            }
          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error);
          }
        };

        chatSocket.onclose = function(e) {
          clearTimeout(connectionTimeout);
          console.log('ℹ️ WebSocket fechado:', e.code, e.reason);
          setConnectionStatus('disconnected');
          chatSocketRef.current = null;
          
          // Tenta reconectar após 3 segundos se não foi fechamento intencional
          if (e.code !== 1000) {
            setTimeout(() => {
              if (getRoomName()) {
                console.log('🔄 Tentando reconectar...');
                connectToDjangoBackend();
              }
            }, 3000);
          }
        };

        chatSocket.onerror = function(e) {
          clearTimeout(connectionTimeout);
          console.error('❌ Erro na conexão WebSocket:', e);
          setConnectionStatus('error');
          chatSocketRef.current = null;
        };

      } catch (error) {
        console.error('❌ Erro ao criar WebSocket:', error);
        setConnectionStatus('error');
        chatSocketRef.current = null;
      }
    };

    connectToDjangoBackend();

    // Cleanup
    return () => {
      if (chatSocketRef.current && chatSocketRef.current.readyState === WebSocket.OPEN) {
        chatSocketRef.current.close(1000, 'Componente desmontado');
      }
    };
  }, [getRoomName, user?.uid, user?.idToken]);

  const getMessageStatus = (status) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-white/40 animate-pulse" />;
      case 'delivered':
        return <Check className="w-3 h-3 text-white/60" />;
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const handleSendMessage = () => {
    console.log('🚀 handleSendMessage chamado!');
    console.log('📝 Mensagem:', message);
    
    if (!message.trim()) {
      console.log('❌ Mensagem vazia, não enviando');
      return;
    }
    
    const messageText = message.trim();
    const timestamp = new Date().toISOString();
    
    // Cria a nova mensagem localmente
    const newMessage = {
      id: Date.now() + Math.random(),
      message: messageText,
      isOwn: true,
      user: user?.displayName || user?.name || 'Você',
      user_id: user?.uid || 'local_user',
      time: new Date().toLocaleTimeString(),
      status: 'sending',
      timestamp: timestamp
    };
    
    // Adiciona a mensagem na interface imediatamente
    setWsMessages(prev => [...prev, newMessage]);
    console.log('✅ Mensagem própria adicionada ao estado:', newMessage);
    
    // Limpa o campo de input
    setMessage('');
    
    // Tenta enviar via WebSocket
    const chatSocket = chatSocketRef.current;
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
      console.log('📤 Enviando via WebSocket para o backend Django:', messageText);
      try {
        const messageData = {
          type: 'chat_message',
          message: messageText
        };
        
        chatSocket.send(JSON.stringify(messageData));
        console.log('✅ Mensagem enviada via WebSocket!');
        
        // Atualizar status para 'delivered' após um pequeno delay
        setTimeout(() => {
          setWsMessages(prev => 
            prev.map(msg => 
              msg.id === newMessage.id && msg.status === 'sending'
                ? { ...msg, status: 'delivered' }
                : msg
            )
          );
        }, 500);
        
      } catch (error) {
        console.error('❌ Erro ao enviar via WebSocket:', error);
        // Marcar mensagem como erro
        setWsMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id
              ? { ...msg, status: 'error' }
              : msg
          )
        );
      }
    } else {
      console.log('🔌 WebSocket não está conectado');
      setWsMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id
            ? { ...msg, status: 'offline' }
            : msg
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para limpar todas as mensagens
  const clearAllMessages = () => {
    setWsMessages([]);
    console.log('🧹 Todas as mensagens foram limpas!');
  };

  // Função para limpar mensagens de outros usuários
  const clearOtherUsersMessages = () => {
    setWsMessages(prev => prev.filter(msg => msg.isOwn));
    console.log('🧹 Mensagens de outros usuários foram limpas!');
  };

  // Adicionar mensagem de teste
  const addTestMessage = () => {
    const testMessage = {
      id: Date.now() + Math.random(),
      message: 'Mensagem de teste do usuário remoto',
      isOwn: false,
      user: 'Usuário Teste',
      user_id: 'test_user_123',
      user_avatar: null,
      time: new Date().toLocaleTimeString(),
      status: 'delivered',
      timestamp: new Date().toISOString()
    };
    console.log('🧪 Adicionando mensagem de teste:', testMessage);
    setWsMessages(prev => [...prev, testMessage]);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-400';
      case 'connecting': return 'bg-yellow-400 animate-pulse';
      case 'error': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Online (Tempo Real)';
      case 'connecting': return 'Conectando...';
      case 'error': return 'Erro de Conexão';
      default: return 'Desconectado';
    }
  };

  const renderTabButton = (tabKey, label, Icon) => (
    <button
      onClick={() => setActiveTab(tabKey)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        activeTab === tabKey
          ? 'bg-white/20 text-white'
          : 'bg-white/10 text-white/70 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  // Calcular estatísticas das mensagens
  const messageStats = {
    total: wsMessages.length,
    own: wsMessages.filter(msg => msg.isOwn).length,
    others: wsMessages.filter(msg => !msg.isOwn).length,
    uniqueUsers: Array.from(new Set(wsMessages.filter(msg => !msg.isOwn).map(msg => msg.user_id))).length
  };

  return (
    <div className="w-full">
      {/* Chat Options */}
      <Card variant="glass" padding="lg">
        <Card.Header>
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">
              {urlRoomCode ? `Chat - Sala: ${urlRoomCode}` : 'Conversas em Tempo Real'}
            </h2>
            {urlRoomCode && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  URL: /home/chat/{urlRoomCode}
                </span>
              </div>
            )}
          </div>
          
          {/* Entrar em sala via código */}
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Digite o código da sala (ex: sala1208)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              variant="glass"
              size="sm"
              className="flex-1"
            />
            <button
              onClick={() => {
                if (!roomCode.trim()) return;
                const salaCode = roomCode.trim();
                console.log('🚪 Entrando na sala:', salaCode);
                
                const newUrl = `/home/chat/${salaCode}`;
                console.log('🔗 Atualizando URL para:', newUrl);
                navigate(newUrl, { replace: true });
                
                setPartnerId(salaCode);
                setSelectedChat(salaCode);
                
                console.log('✅ Sala configurada e URL atualizada');
              }}
              disabled={!roomCode.trim()}
              className="px-3 py-2 bg-white text-black rounded-lg disabled:opacity-50"
            >
              Entrar
            </button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {renderTabButton('conversas', 'Conversas', MessageCircle)}
              {renderTabButton('psicologos', 'Psicólogos', User)}
              {renderTabButton('grupos', 'Grupos', Users)}
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          {/* Mostrar apenas quando há uma sala ativa */}
          {!partnerId && !urlRoomCode && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/70 mb-2">Digite um código de sala para começar</h3>
              <p className="text-white/50">Ou use a URL diretamente: /home/chat/nomeddasala</p>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Chat Interface */}
      {(partnerId || urlRoomCode) && (
        <Card variant="glass" className="overflow-hidden mt-4">
          {/* Chat Header */}
          <div className="bg-white/5 p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setSelectedChat(null);
                    setSelectedGroup(null);
                    setPartnerId('');
                    navigate('/home/chat', { replace: true });
                  }}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </button>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Conversa</h3>
                  <p className="text-sm text-white/70">Sala: {urlRoomCode || partnerId}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`}></div>
                    <span className={`text-xs ${
                      connectionStatus === 'connected' ? 'text-green-400' : 
                      connectionStatus === 'connecting' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {getConnectionStatusText()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Status e Controles */}
              <div className="flex items-center space-x-2">
                <div className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded">
                  📊 {messageStats.total} msgs | 👤 {messageStats.own} suas | 👥 {messageStats.others} outros
                </div>
                <button
                  onClick={addTestMessage}
                  className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded hover:bg-blue-500/30 transition-colors"
                  title="Adicionar mensagem de teste"
                >
                  🧪 Teste
                </button>
                <button
                  onClick={clearOtherUsersMessages}
                  className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded hover:bg-orange-500/30 transition-colors"
                  title="Limpar mensagens de outros usuários"
                >
                  🧹 Outros
                </button>
                <button
                  onClick={clearAllMessages}
                  className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded hover:bg-red-500/30 transition-colors"
                  title="Limpar todas as mensagens"
                >
                  🗑️ Tudo
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {wsMessages.length > 0 ? (
              <>
                {wsMessages.map((msg, index) => {
                  console.log(`🔍 Renderizando mensagem ${index}:`, msg);
                  return (
                    <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
                      {!msg.isOwn && (
                        /* Avatar e nome do usuário (lado esquerdo) */
                        <div className="flex flex-col items-center mr-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-white/20">
                            {msg.user_avatar ? (
                              <img 
                                src={msg.user_avatar} 
                                alt={msg.user} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/70 text-lg font-bold">
                                {msg.user.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-white/60 mt-1 max-w-20 truncate">
                            {msg.user}
                          </span>
                        </div>
                      )}
                      
                      {/* Balão de mensagem */}
                      <div className={`max-w-xs px-4 py-3 rounded-2xl relative ${
                        msg.isOwn 
                          ? 'bg-blue-500 text-white rounded-br-md' 
                          : 'bg-white/10 text-white rounded-bl-md border border-white/20'
                      }`}>
                        {/* Conteúdo da mensagem */}
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                        
                        {/* Timestamp e status */}
                        <div className="flex items-center justify-between mt-2">
                          <span className={`text-xs ${
                            msg.isOwn ? 'text-blue-100' : 'text-white/50'
                          }`}>
                            {msg.time}
                          </span>
                          {msg.isOwn && (
                            <div className="flex items-center space-x-1">
                              {getMessageStatus(msg.status)}
                              {msg.status === 'error' && (
                                <span className="text-xs text-red-400">Erro</span>
                              )}
                              {msg.status === 'offline' && (
                                <span className="text-xs text-yellow-400">Offline</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {msg.isOwn && (
                        /* Avatar do usuário (lado direito) */
                        <div className="flex flex-col items-center ml-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-400 border-2 border-blue-300">
                            <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                              Eu
                            </div>
                          </div>
                          <span className="text-xs text-white/60 mt-1">
                            Você
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50">Nenhuma mensagem ainda</p>
                <p className="text-sm text-white/30">Comece a conversa!</p>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                variant="glass"
                size="sm"
                className="flex-1"
                disabled={connectionStatus !== 'connected'}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!message.trim() || connectionStatus !== 'connected'}
                className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {connectionStatus !== 'connected' && (
              <div className="text-xs text-yellow-400 mt-2 text-center">
                {connectionStatus === 'connecting' ? 'Conectando ao servidor...' : 'Sem conexão com o servidor'}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LiveChat;