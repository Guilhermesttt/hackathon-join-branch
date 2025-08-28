import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export const useNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await auth.signOut();
      navigate('/login');
      return { success: true };
    } catch (error) {
      console.error('Erro ao sair:', error);
      return { success: false, error: 'Erro ao sair. Tente novamente.' };
    }
  }, [navigate]);

  const navigateToUser = useCallback((userId) => {
    navigate(`/user/${userId}`);
  }, [navigate]);

  const navigateToNotifications = useCallback(() => {
    navigate('/notifications');
  }, [navigate]);

  const navigateToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    handleLogout,
    navigateToUser,
    navigateToNotifications,
    navigateToLogin,
    navigateToHome,
    navigate
  };
};
