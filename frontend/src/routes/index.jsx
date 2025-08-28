import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componentes de páginas
import App from '../App.jsx';
import Login from '../Login.jsx';
import Register from '../Register.jsx';
import Connected from '../Connected.jsx';
import CompleteProfile from '../CompleteProfile.jsx';
import MainLayout from '../Components/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import DiaryPage from '../pages/DiaryPage.jsx';
import HumorTracker from '../Components/HumorTracker.jsx';
import Profile from '../Components/Profile.jsx';
import UserProfile from '../Components/UserProfile.jsx';
import CommunityGroup from '../Components/CommunityGroup.jsx';
import CommunityGroups from '../Components/CommunityGroups.jsx';
import ExploreCommunities from '../Components/ExploreCommunities.jsx';
import TherapySessions from '../Components/TherapySessions.jsx';
import LiveChat from '../Components/LiveChat.jsx';
import Settings from '../Components/Settings.jsx';
import PostDetail from '../Components/PostDetail.jsx';
import Notifications from '../Components/Notifications.jsx';
import WelcomeTour from '../Components/WelcomeTour.jsx';

// Componente para rotas protegidas
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

// Componente para rotas de psicólogos
const PsychologistRoute = ({ children }) => {
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

  if (user.role !== 'psicologo') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Componente para usuários com perfil completo
const CompleteProfileRoute = ({ children }) => {
  const { user, loading, needsProfileCompletion } = useAuth();

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

  if (needsProfileCompletion) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

// Configuração das rotas
export const routes = [
  // ===== ROTAS PÚBLICAS =====
  {
    path: '/',
    element: <App />,
    public: true,
    title: 'Sereno - Início'
  },
  {
    path: '/login',
    element: <Login />,
    public: true,
    title: 'Sereno - Login'
  },
  {
    path: '/register',
    element: <Register />,
    public: true,
    title: 'Sereno - Registro'
  },
  {
    path: '/connected',
    element: <Connected />,
    public: true,
    title: 'Sereno - Conectado'
  },

  // ===== ROTAS DE PERFIL =====
  {
    path: '/complete-profile',
    element: <ProtectedRoute><CompleteProfile /></ProtectedRoute>,
    protected: true,
    title: 'Sereno - Completar Perfil',
    category: 'profile'
  },

  // ===== ROTAS PRINCIPAIS (requerem perfil completo) =====
  {
    path: '/home',
    element: <CompleteProfileRoute><MainLayout><HomePage /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Home',
    category: 'main'
  },
  {
    path: '/home/profile',
    element: <CompleteProfileRoute><MainLayout><Profile /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Meu Perfil',
    category: 'main'
  },
  {
    path: '/home/sessions',
    element: <CompleteProfileRoute><MainLayout><TherapySessions /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Sessões de Terapia',
    category: 'main'
  },
  {
    path: '/home/diary',
    element: <CompleteProfileRoute><MainLayout><DiaryPage /></MainLayout></CompleteProfileRoute>,
    protected: true,
            title: 'Sereno - Diário Evolutivo',
    category: 'main'
  },
  {
    path: '/home/humor',
    element: <CompleteProfileRoute><MainLayout><HumorTracker /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Rastreador de Humor',
    category: 'main'
  },
  {
    path: '/home/chat/:roomCode',
    element: <CompleteProfileRoute><MainLayout><LiveChat /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Chat ao Vivo',
    category: 'main'
  },
  {
    path: '/home/chat',
    element: <CompleteProfileRoute><MainLayout><LiveChat /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Chat ao Vivo',
    category: 'main'
  },
  {
    path: '/home/groups',
    element: <CompleteProfileRoute><MainLayout><CommunityGroups /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Grupos',
    category: 'main'
  },
  {
    path: '/home/notifications',
    element: <CompleteProfileRoute><MainLayout><Notifications /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Notificações',
    category: 'main'
  },
  {
    path: '/home/settings',
    element: <CompleteProfileRoute><MainLayout><Settings /></MainLayout></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Configurações',
    category: 'main'
  },
  {
    path: '/profile',
    element: <CompleteProfileRoute><Profile /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Meu Perfil',
    category: 'main'
  },
  {
    path: '/profile/:userId',
    element: <CompleteProfileRoute><Profile /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Perfil',
    category: 'main'
  },
  {
    path: '/user/:userId',
    element: <CompleteProfileRoute><UserProfile /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Perfil do Usuário',
    category: 'main'
  },
  {
    path: '/welcome-tour',
    element: <CompleteProfileRoute><WelcomeTour /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Tour de Boas-vindas',
    category: 'main'
  },

  // ===== ROTAS DE COMUNIDADE =====
  {
    path: '/groups',
    element: <CompleteProfileRoute><CommunityGroups /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Grupos',
    category: 'community'
  },
  {
    path: '/explore',
    element: <CompleteProfileRoute><ExploreCommunities /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Explorar Comunidades',
    category: 'community'
  },
  {
    path: '/community/:communityId',
    element: <CompleteProfileRoute><CommunityGroup /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Comunidade',
    category: 'community'
  },

  // ===== ROTAS DE SAÚDE MENTAL =====
  {
    path: '/humor-tracker',
    element: <CompleteProfileRoute><HumorTracker /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Rastreador de Humor',
    category: 'mental-health'
  },
  {
    path: '/therapy-sessions',
    element: <CompleteProfileRoute><TherapySessions /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Sessões de Terapia',
    category: 'mental-health'
  },

  // ===== ROTAS DE COMUNICAÇÃO =====
  {
    path: '/live-chat',
    element: <CompleteProfileRoute><LiveChat /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Chat ao Vivo',
    category: 'communication'
  },
  {
    path: '/chat/:roomCode',
    element: <CompleteProfileRoute><LiveChat /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Chat',
    category: 'communication'
  },
  {
    path: '/post/:postId',
    element: <CompleteProfileRoute><PostDetail /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Post',
    category: 'communication'
  },

  // ===== ROTAS DE CONFIGURAÇÃO =====
  {
    path: '/settings',
    element: <CompleteProfileRoute><Settings /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Configurações',
    category: 'settings'
  },
  {
    path: '/notifications',
    element: <CompleteProfileRoute><Notifications /></CompleteProfileRoute>,
    protected: true,
    title: 'Sereno - Notificações',
    category: 'settings'
  },

  // ===== ROTA DE FALLBACK =====
  {
    path: '*',
    element: <Navigate to="/" replace />,
    public: true,
    title: 'Sereno - Página não encontrada'
  }
];

// Função para obter rotas por categoria
export const getRoutesByCategory = (category) => {
  return routes.filter(route => route.category === category && route.protected);
};

// Função para obter rotas públicas
export const getPublicRoutes = () => {
  return routes.filter(route => route.public);
};

// Função para obter rotas protegidas
export const getProtectedRoutes = () => {
  return routes.filter(route => route.protected);
};

// Função para verificar se uma rota é protegida
export const isRouteProtected = (path) => {
  const route = routes.find(r => r.path === path);
  return route ? route.protected : false;
};

// Função para obter informações de uma rota
export const getRouteInfo = (path) => {
  return routes.find(r => r.path === path);
};

// Função para obter o título de uma rota
export const getRouteTitle = (path) => {
  const route = getRouteInfo(path);
  return route ? route.title : 'Sereno';
};

export default routes;
