import React, { useEffect } from 'react';
import { Bell, Check, Trash2, MessageCircle, Heart, UserPlus, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import { firestoreUtils } from '../../services/firestoreService';

const NotificationsList = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    loading, 
    error, 
    unreadCount, 
    markAsRead,
    subscribeToNotifications 
  } = useNotifications(user?.uid);

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return () => unsubscribe?.();
  }, [subscribeToNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return { icon: Heart, color: 'text-red-400' };
      case 'comment':
        return { icon: MessageCircle, color: 'text-blue-400' };
      case 'follow':
        return { icon: UserPlus, color: 'text-green-400' };
      case 'session':
        return { icon: Calendar, color: 'text-yellow-400' };
      default:
        return { icon: Bell, color: 'text-gray-400' };
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(notification => markAsRead(notification.id))
      );
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

  if (error) {
    return (
      <div className="text-center py-20">
        <EmptyState
          icon={Bell}
          title="Erro ao carregar notificações"
          description={error}
          action={
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Notificações
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                  {unreadCount}
                </span>
              )}
            </h2>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllAsRead}
              variant="secondary"
              size="sm"
              leftIcon={Check}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nenhuma notificação"
          description="Você está em dia com tudo!"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const { icon: Icon, color } = getNotificationIcon(notification.type);
            
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-300 hover:bg-white/10 ${
                  notification.read
                    ? 'bg-white/5 border-white/10 text-white/70'
                    : 'bg-blue-500/10 border-blue-500/30 text-white'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white/10 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-1">{notification.title}</p>
                        <p className="text-sm opacity-80 mb-2">{notification.message}</p>
                        <span className="text-xs opacity-60">
                          {firestoreUtils.formatRelativeTime(
                            firestoreUtils.convertTimestamp(notification.createdAt)
                          )}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-3">
                        {!notification.read && (
                          <Button
                            onClick={() => handleMarkAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsList;