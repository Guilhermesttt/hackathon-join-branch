import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner"></div>
        <div className="text-white ml-3">Carregando...</div>
      </div>
    );
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !user) {
    // Salvar a rota atual para redirecionar após login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se não requer autenticação mas usuário está logado e tentando acessar login/register
  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  // Renderizar o conteúdo protegido
  return children;
};

export default ProtectedRoute;
