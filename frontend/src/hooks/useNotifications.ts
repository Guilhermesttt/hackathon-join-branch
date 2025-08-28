import { useState, useEffect, useCallback } from 'react';
import { notificationService, firebaseUtils } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'group' | 'session' | 'mood' | 'system';
  title: string;
  message: string;
  recipientId: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  postId?: string;
  groupId?: string;
  sessionId?: string;
  createdAt: any;
  read: boolean;
  readAt?: any;
  actionUrl?: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  // Carregar notificações do usuário
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      const fetchedNotifications = await notificationService.getUserNotifications(user.uid, 100);
      
      // Converter timestamps e formatar dados
      const formattedNotifications = fetchedNotifications.map(notification => ({
        ...notification,
        createdAt: firebaseUtils.convertTimestamp(notification.createdAt),
        readAt: notification.readAt ? firebaseUtils.convertTimestamp(notification.readAt) : undefined
      }));
      
      setNotifications(formattedNotifications);
      
      // Calcular contador de não lidas
      const unread = formattedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar notificações');
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const result = await notificationService.markNotificationAsRead(notificationId);
      
      if (result.success) {
        // Atualizar estado local
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => {
            if (notification.id === notificationId) {
              return {
                ...notification,
                read: true,
                readAt: new Date()
              };
            }
            return notification;
          })
        );
        
        // Atualizar contador de não lidas
        setUnreadCount(prev => Math.max(0, prev - 1));
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      throw err;
    }
  }, []);

  // Marcar todas as notificações como lidas
  const markAllAsRead = useCallback(async () => {
    if (!user) return false;

    try {
      const result = await notificationService.markAllNotificationsAsRead(user.uid);
      
      if (result.success) {
        // Atualizar estado local
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({
            ...notification,
            read: true,
            readAt: new Date()
          }))
        );
        
        // Zerar contador de não lidas
        setUnreadCount(0);
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao marcar todas as notificações como lidas:', err);
      throw err;
    }
  }, [user]);

  // Criar notificação (para uso interno)
  const createNotification = useCallback(async (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const result = await notificationService.createNotification(notificationData);
      
      if (result.success) {
        // Adicionar nova notificação ao estado local
        const newNotification: Notification = {
          ...notificationData,
          id: result.notificationId,
          createdAt: new Date(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        return result.notificationId;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao criar notificação:', err);
      throw err;
    }
  }, []);

  // Deletar notificação
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // TODO: Implementar deleteNotification no service
      // const result = await notificationService.deleteNotification(notificationId);
      
      // Por enquanto, apenas remover do estado local
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      return true;
    } catch (err) {
      console.error('Erro ao deletar notificação:', err);
      throw err;
    }
  }, [notifications]);

  // Filtrar notificações por tipo
  const filterByType = useCallback((type: Notification['type']) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  // Filtrar notificações não lidas
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  // Filtrar notificações lidas
  const getReadNotifications = useCallback(() => {
    return notifications.filter(notification => notification.read);
  }, [notifications]);

  // Buscar notificação por ID
  const getNotificationById = useCallback((notificationId: string) => {
    return notifications.find(notification => notification.id === notificationId);
  }, [notifications]);

  // Carregar notificações na inicialização
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user, loadNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification,
    filterByType,
    getUnreadNotifications,
    getReadNotifications,
    getNotificationById,
    refreshNotifications: loadNotifications
  };
};
