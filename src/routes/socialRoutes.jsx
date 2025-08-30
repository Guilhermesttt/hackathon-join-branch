import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Social Network Pages
import SocialHomePage from '../pages/SocialHomePage';
import SearchPage from '../pages/SearchPage';
import MessagesPage from '../pages/MessagesPage';
import NotificationsPage from '../pages/NotificationsPage';
import ProfilePage from '../pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner"></div>
        <div className="text-white ml-3">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Social Network Routes Configuration
export const socialRoutes = [
  // ===== MAIN SOCIAL ROUTES =====
  {
    path: '/home',
    element: <ProtectedRoute><SocialHomePage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Início',
    category: 'social'
  },
  {
    path: '/search',
    element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Buscar',
    category: 'social'
  },
  {
    path: '/messages',
    element: <ProtectedRoute><MessagesPage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Mensagens',
    category: 'social'
  },
  {
    path: '/notifications',
    element: <ProtectedRoute><NotificationsPage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Notificações',
    category: 'social'
  },
  {
    path: '/profile',
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Meu Perfil',
    category: 'social'
  },
  {
    path: '/profile/:userId',
    element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Perfil',
    category: 'social'
  },

  // ===== ADDITIONAL SOCIAL ROUTES =====
  {
    path: '/explore',
    element: <ProtectedRoute><SearchPage /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Explorar',
    category: 'social'
  },
  {
    path: '/communities',
    element: <ProtectedRoute><SocialHomePage /></ProtectedRoute>, // Placeholder
    protected: true,
    title: 'Sereno - Comunidades',
    category: 'social'
  },
  {
    path: '/bookmarks',
    element: <ProtectedRoute><SocialHomePage /></ProtectedRoute>, // Placeholder
    protected: true,
    title: 'Sereno - Salvos',
    category: 'social'
  },
  {
    path: '/liked',
    element: <ProtectedRoute><SocialHomePage /></ProtectedRoute>, // Placeholder
    protected: true,
    title: 'Sereno - Curtidas',
    category: 'social'
  }
];

export default socialRoutes;