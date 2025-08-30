import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Send, 
  Search, 
  User, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Plus,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const DirectMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data for conversations
  const mockConversations = [
    {
      id: 'conv1',
      participants: ['user1', user?.uid],
      otherUser: {
        id: 'user1',
        displayName: 'Ana Silva',
        username: 'ana_silva',
        photoURL: null,
        isOnline: true,
        lastSeen: new Date()
      },
      lastMessage: {
        id: 'msg1',
        content: 'Oi! Como você está se sentindo hoje?',
        senderId: 'user1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false
      },
      unreadCount: 2
    },
    {
      id: 'conv2',
      participants: ['user2', user?.uid],
      otherUser: {
        id: 'user2',
        displayName: 'Carlos Santos',
        username: 'carlos_santos',
        photoURL: null,
        isOnline: false,
        lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      lastMessage: {
        id: 'msg2',
        content: 'Obrigado pela dica de meditação! 🧘‍♂️',
        senderId: user?.uid,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true
      },
      unreadCount: 0
    },
    {
      id: 'conv3',
      participants: ['user3', user?.uid],
      otherUser: {
        id: 'user3',
        displayName: 'Maria Costa',
        username: 'maria_costa',
        photoURL: null,
        isOnline: true,
        lastSeen: new Date()
      },
      lastMessage: {
        id: 'msg3',
        content: 'Vamos marcar aquela sessão de terapia em grupo?',
        senderId: 'user3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        read: true
      },
      unreadCount: 0
    }
  ];

  // Mock messages for selected conversation
  const mockMessages = [
    {
      id: 'msg1',
      content: 'Oi! Como você está se sentindo hoje?',
      senderId: 'user1',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      type: 'text'
    },
    {
      id: 'msg2',
      content: 'Estou bem, obrigado por perguntar! Hoje foi um dia mais tranquilo. Como foi o seu dia?',
      senderId: user?.uid,
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      read: true,
      type: 'text'
    },
    {
      id: 'msg3',
      content: 'Que bom! Lembra da técnica de respiração que conversamos? Tem usado?',
      senderId: 'user1',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      type: 'text'
    },
    {
      id: 'msg4',
      content: 'Sim! Tem me ajudado muito, especialmente antes de dormir. Muito obrigado pela dica! 🙏',
      senderId: user?.uid,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: true,
      type: 'text'
    }
  ];

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConversations(mockConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        senderId: user.uid,
        timestamp: new Date(),
        read: false,
        type: 'text'
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // TODO: Send message to Firebase
      console.log('Sending message:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  };

  const formatLastSeen = (lastSeen) => {
    const date = lastSeen instanceof Date ? lastSeen : new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = (now - date) / (1000 * 60);
    
    if (diffInMinutes < 5) return 'Online agora';
    if (diffInMinutes < 60) return `Visto há ${Math.floor(diffInMinutes)}m`;
    
    const diffInHours = diffInMinutes / 60;
    if (diffInHours < 24) return `Visto há ${Math.floor(diffInHours)}h`;
    
    const diffInDays = diffInHours / 24;
    return `Visto há ${Math.floor(diffInDays)}d`;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/70">Carregando conversas...</span>
      </div>
    );
  }

  return (
    <div className="h-[700px] bg-black border border-white/20 rounded-2xl overflow-hidden flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-white/20 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Mensagens</h2>
            </div>
            
            <Button
              onClick={() => setShowNewChatModal(true)}
              variant="ghost"
              size="sm"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Search */}
          <Input
            type="text"
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
            variant="glass"
            size="sm"
          />
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={MessageCircle}
                title="Nenhuma conversa"
                description="Comece uma nova conversa!"
                variant="muted"
              />
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-white/20 border border-white/30'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {/* Avatar with online status */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                        {conversation.otherUser.photoURL ? (
                          <img 
                            src={conversation.otherUser.photoURL} 
                            alt={conversation.otherUser.displayName} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-7 h-7 text-white/70" />
                        )}
                      </div>
                      
                      {/* Online indicator */}
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-black ${
                        conversation.otherUser.isOnline ? 'bg-green-400' : 'bg-white/30'
                      }`} />
                    </div>

                    {/* Conversation Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-white truncate text-base">
                          {conversation.otherUser.displayName}
                        </h4>
                        <span className="text-xs text-white/50">
                          {formatMessageTime(conversation.lastMessage.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-white/60 truncate">
                        {conversation.lastMessage.senderId === user?.uid ? 'Você: ' : ''}
                        {conversation.lastMessage.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-white/40">
                          @{conversation.otherUser.username}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-white text-black text-xs px-2 py-1 rounded-full font-bold">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedConversation(null)}
                  className="lg:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    {selectedConversation.otherUser.photoURL ? (
                      <img 
                        src={selectedConversation.otherUser.photoURL} 
                        alt={selectedConversation.otherUser.displayName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white/70" />
                    )}
                  </div>
                  {selectedConversation.otherUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-black rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-bold text-white text-lg">
                    {selectedConversation.otherUser.displayName}
                  </h3>
                  <p className="text-sm text-white/60">
                    {selectedConversation.otherUser.isOnline 
                      ? 'Online agora' 
                      : formatLastSeen(selectedConversation.otherUser.lastSeen)
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => {
                const isOwn = message.senderId === user?.uid;
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          isOwn
                            ? 'bg-white text-black rounded-br-md'
                            : 'bg-white/10 text-white border border-white/20 rounded-bl-md'
                        }`}
                      >
                        <p className="text-base leading-relaxed">{message.content}</p>
                      </div>
                      
                      <div className={`flex items-center mt-2 space-x-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-white/50">
                          {formatMessageTime(message.timestamp)}
                        </span>
                        
                        {isOwn && (
                          <div className="text-white/50">
                            {message.read ? (
                              <CheckCheck className="w-3 h-3" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-white/20">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Paperclip className="w-5 h-5" />
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <Smile className="w-5 h-5" />
                </Button>
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                    disabled={sendingMessage}
                  />
                </div>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  loading={sendingMessage}
                  size="default"
                  className="px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={MessageCircle}
              title="Selecione uma conversa"
              description="Escolha uma conversa para começar a trocar mensagens"
              variant="muted"
            />
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Nova Conversa</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNewChatModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Buscar usuários..."
                leftIcon={Search}
                variant="glass"
              />
              
              <div className="text-center py-8">
                <User className="w-12 h-12 text-white/30 mx-auto mb-3" />
                <p className="text-white/50">Digite para buscar usuários</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectMessages;