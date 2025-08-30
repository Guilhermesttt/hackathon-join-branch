import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Users, 
  Calendar,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Filter,
  X,
  Star,
  Share2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const NotificationCenter = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(user?.uid);
  
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Mock notifications for demonstration
  const mockNotifications = [
    {
      id: 'notif1',
      type: 'like',
      title: 'Nova curtida',
      message: 'Ana Silva curtiu seu post sobre mindfulness',
      recipientId: user?.uid,
      senderId: 'user1',
      senderName: 'Ana Silva',
      senderAvatar: null,
      postId: 'post1',
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      actionUrl: '/post/post1'
    },
    {
      id: 'notif2',
      type: 'comment',
      title: 'Novo comentário',
      message: 'Carlos Santos comentou: "Muito inspirador! Obrigado por compartilhar"',
      recipientId: user?.uid,
      senderId: 'user2',
      senderName: 'Carlos Santos',
      senderAvatar: null,
      postId: 'post2',
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
      actionUrl: '/post/post2'
    },
    {
      id: 'notif3',
      type: 'follow',
      title: 'Novo seguidor',
      message: 'Maria Costa começou a te seguir',
      recipientId: user?.uid,
      senderId: 'user3',
      senderName: 'Maria Costa',
      senderAvatar: null,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      actionUrl: '/user/user3'
    },
    {
      id: 'notif4',
      type: 'group',
      title: 'Atividade no grupo',
      message: 'Novo post no grupo "Ansiedade & Bem-estar"',
      recipientId: user?.uid,
      senderId: 'user4',
      senderName: 'Pedro Oliveira',
      senderAvatar: null,
      groupId: 'group1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
      actionUrl: '/group/group1'
    },
    {
      id: 'notif5',
      type: 'session',
      title: 'Lembrete de sessão',
      message: 'Sua sessão de terapia está agendada para amanhã às 14h',
      recipientId: user?.uid,
      senderId: 'system',
      senderName: 'Sistema',
      sessionId: 'session1',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: true,
      actionUrl: '/sessions'
    }
  ];

  useEffect(() => {
    // Use mock data for now
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { icon: Heart, color: 'text-red-400', bgColor: 'bg-red-500/20' };
      case 'comment':
        return { icon: MessageCircle, color: 'text-blue-400', bgColor: 'bg-blue-500/20' };
      case 'follow':
        return { icon: UserPlus, color: 'text-green-400', bgColor: 'bg-green-500/20' };
      case 'group':
        return { icon: Users, color: 'text-purple-400', bgColor: 'bg-purple-500/20' };
      case 'session':
        return { icon: Calendar, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
      case 'share':
        return { icon: Share2, color: 'text-cyan-400', bgColor: 'bg-cyan-500/20' };
      default:
        return { icon: Bell, color: 'text-white/60', bgColor: 'bg-white/10' };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Agora mesmo';
    
    const now = new Date();
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'agora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const filteredNotifications = mockNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    if (filter === 'likes') return notification.type === 'like';
    if (filter === 'comments') return notification.type === 'comment';
    if (filter === 'follows') return notification.type === 'follow';
    return true;
  });

  const unreadNotifications = mockNotifications.filter(n => !n.read);

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      // TODO: Mark as read
      console.log('Marking as read:', notification.id);
    }
    
    // Navigate to relevant page
    if (notification.actionUrl) {
      console.log('Navigating to:', notification.actionUrl);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // TODO: Implement mark all as read
      console.log('Marking all as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/70">Carregando notificações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">
              Notificações
              {unreadNotifications.length > 0 && (
                <span className="ml-3 px-3 py-1 bg-white text-black text-sm rounded-full font-bold">
                  {unreadNotifications.length}
                </span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadNotifications.length > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="secondary"
                size="sm"
                leftIcon={CheckCheck}
              >
                Marcar todas como lidas
              </Button>
            )}
            
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              size="sm"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Todas', count: mockNotifications.length },
            { id: 'unread', label: 'Não lidas', count: unreadNotifications.length },
            { id: 'likes', label: 'Curtidas', count: mockNotifications.filter(n => n.type === 'like').length },
            { id: 'comments', label: 'Comentários', count: mockNotifications.filter(n => n.type === 'comment').length },
            { id: 'follows', label: 'Seguidores', count: mockNotifications.filter(n => n.type === 'follow').length }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span className="ml-2 text-xs opacity-70">({filterOption.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title={filter === 'unread' ? 'Nenhuma notificação não lida' : 'Nenhuma notificação'}
            description={filter === 'unread' ? 'Você está em dia com tudo!' : 'Suas notificações aparecerão aqui'}
            variant="muted"
          />
        ) : (
          filteredNotifications.map((notification) => {
            const { icon: Icon, color, bgColor } = getNotificationIcon(notification.type);
            
            return (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-6 rounded-2xl border transition-all duration-200 cursor-pointer hover:bg-white/10 hover:border-white/30 group ${
                  notification.read
                    ? 'bg-black border-white/20 text-white/70'
                    : 'bg-white/5 border-white/30 text-white'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Notification Icon */}
                  <div className={`p-3 rounded-xl ${bgColor} flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                  </div>
                  
                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-bold mb-2 text-lg">
                          {notification.title}
                        </h4>
                        <p className="text-base opacity-80 mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm opacity-60">
                            {formatTime(notification.createdAt)}
                          </span>
                          {notification.senderName && notification.senderName !== 'Sistema' && (
                            <>
                              <span className="text-white/30">•</span>
                              <span className="text-sm text-white/60">
                                por {notification.senderName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.read && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Delete notification
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/50 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Configurações de Notificação</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'likes', label: 'Curtidas nos seus posts', icon: Heart },
                { key: 'comments', label: 'Comentários nos seus posts', icon: MessageCircle },
                { key: 'follows', label: 'Novos seguidores', icon: UserPlus },
                { key: 'messages', label: 'Mensagens diretas', icon: MessageCircle },
                { key: 'groups', label: 'Atividade em grupos', icon: Users }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <setting.icon className="w-5 h-5 text-white/70" />
                    <span className="text-white font-medium">{setting.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/40"></div>
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowSettings(false)}>
                Salvar Configurações
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;