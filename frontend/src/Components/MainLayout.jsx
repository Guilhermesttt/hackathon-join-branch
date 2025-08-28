import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import SuggestedGroups from './SuggestedGroups';
import MoodTracker from './MoodTracker';
import FloatingParticles from './FloatingParticles';
import LightWaves from './LightWaves';
import NotificationToast from './NotificationToast';
import WelcomeTour from './WelcomeTour';
import { useAuth } from '../contexts/AuthContext';

function MainLayout({ children, showSidebars = true }) {
  const [showTour, setShowTour] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const { user, isFirstTime, markTourAsSeen } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determinar aba ativa baseado na URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/home') return 'home';
    if (path === '/home/profile') return 'profile';
    if (path === '/home/sessions') return 'sessions';
    if (path === '/home/diary') return 'diary';
    if (path === '/home/humor') return 'humor';
    if (path === '/home/chat' || path.startsWith('/home/chat/')) return 'chat';
    if (path === '/home/groups') return 'groups';
    if (path === '/home/notifications') return 'notifications';
    if (path === '/home/settings') return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab();

  // Mostrar tour automaticamente na primeira vez
  useEffect(() => {
    if (isFirstTime && user) {
      setShowTour(true);
    }
  }, [isFirstTime, user]);

  // Mostrar notificação de boas-vindas para novos usuários
  useEffect(() => {
    if (isFirstTime && user) {
      const timer = setTimeout(() => {
        setShowWelcomeNotification(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstTime, user]);

  const handleStartTour = () => {
    setShowTour(true);
  };

  const handleCloseTour = async () => {
    setShowTour(false);
    
    if (isFirstTime) {
      setShowWelcomeMessage(true);
      await markTourAsSeen();
    }
  };

  const handleCloseWelcomeNotification = () => {
    setShowWelcomeNotification(false);
  };

  const handleTabChange = (tab) => {
    if (tab === 'home') {
      navigate('/home');
    } else {
      navigate(`/home/${tab}`);
    }
  };

  const renderSidebars = () => {
    if (!showSidebars) return null;

    if (activeTab === 'home') {
      return (
        <>
          {/* Left Sidebar - Suggested Groups */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <SuggestedGroups setActiveTab={handleTabChange} />
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-6 space-y-8">
            {children}
          </section>

          {/* Right Sidebar - Mood Tracker */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <MoodTracker />
            </div>
          </aside>
        </>
      );
    } else if (activeTab === 'profile') {
      return (
        <section className="lg:col-span-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </section>
      );
    } else {
      return (
        <section className="lg:col-span-12">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </section>
      );
    }
  };

  return (
    <>
      <LightWaves />
      <div className="min-h-screen bg-black lg:pb-8 pb-20">
        <Header activeTab={activeTab} setActiveTab={handleTabChange} onStartTour={handleStartTour} />
      
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {renderSidebars()}
          </div>
        </main>

        {/* Welcome Tour */}
        <WelcomeTour 
          isOpen={showTour} 
          onClose={handleCloseTour}
          userRole={user?.role || 'cliente'}
          isFirstTime={isFirstTime}
        />

        {/* Welcome Notification */}
        <NotificationToast
          message="Bem-vindo ao Sereno! 🎉 Estamos felizes em tê-lo conosco nesta jornada de autoconhecimento e bem-estar."
          type="success"
          duration={8000}
          isVisible={showWelcomeNotification}
          onClose={handleCloseWelcomeNotification}
        />
      </div>
    </>
  );
}

export default MainLayout;
