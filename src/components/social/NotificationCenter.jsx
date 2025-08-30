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
  Filter
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
      default:
        return { icon: Bell, color: 'text-white/60', bgColor: 'bg-white/10' };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Agora mesmo';
    
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate to relevant page
    if (notification.actionUrl) {
      // TODO: Navigate to notification target
      console.log('Navigating to:', notification.actionUrl);
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
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Notificações
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-white text-black text-sm rounded-full font-medium">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
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
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'unread', label: 'Não lidas' },
            { id: 'read', label: 'Lidas' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
              }`}
            >
              {filterOption.label}
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
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-white/10 ${
                  notification.read
                    ? 'bg-white/5 border-white/10 text-white/70'
                    : 'bg-white/10 border-white/20 text-white'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Notification Icon */}
                  <div className={`p-2 rounded-xl ${bgColor} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  
                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm opacity-80 mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <span className="text-xs opacity-60">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-3">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Delete notification
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Configurações de Notificação</h3>
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
                { key: 'likes', label: 'Curtidas nos seus posts' },
                { key: 'comments', label: 'Comentários nos seus posts' },
                { key: 'follows', label: 'Novos seguidores' },
                { key: 'messages', label: 'Mensagens diretas' },
                { key: 'groups', label: 'Atividade em grupos' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <span className="text-white">{setting.label}</span>
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
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;