import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Search, Home, MessageCircle, Calendar, BarChart3, Settings, Menu, X, Bell, BookOpen, HelpCircle, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import Input from '../Components/ui/Input';

const Header = React.memo(({ activeTab, setActiveTab, onStartTour }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
    setIsDropdownOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
    setIsMenuOpen(false);
  }, []);

  const closeAllMenus = useCallback(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, []);

  const navItems = useMemo(() => {
    const items = [
      { name: 'Início', tab: 'home', icon: Home },
      { name: 'Chat', tab: 'chat', icon: MessageCircle },
      { name: 'Diário', tab: 'diary', icon: BookOpen },
      { name: 'Humor', tab: 'humor', icon: BarChart3 },
    ];

    return items;
  }, [user?.role]);

  const handleNavClick = useCallback((tabName) => {
    if (tabName === 'home') {
      navigate('/home');
    } else {
      navigate(`/home/${tabName}`);
    }
    closeAllMenus();
  }, [navigate, closeAllMenus]);

  const handleLogout = useCallback(async () => {
    try {
      const { auth } = await import('../firebase');
      await auth.signOut();
      navigate('/login');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Erro ao sair:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  }, [navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar busca
      console.log('Searching for:', searchQuery);
    }
  }, [searchQuery]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeAllMenus();
      }
    };

    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen, isDropdownOpen, closeAllMenus]);

  // Fechar menus ao pressionar Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeAllMenus();
      }
    };

    if (isMenuOpen || isDropdownOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen, isDropdownOpen, closeAllMenus]);

  // Prevenir scroll do body quando menu está aberto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  if (loading) {
    return (
      <header className="glass-header sticky top-0 z-50">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            <div className="loading-spinner"></div>
            <span className="text-white/70">Carregando...</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="glass-header sticky top-0 z-30 animation-initial animate-slide-in-top">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Button */}
            <button
              className="show-mobile btn-icon group"
              onClick={toggleMenu}
              aria-label="Abrir menu de navegação"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <button 
              onClick={() => navigate('/home')} 
              className="logo-button group"
              aria-label="Ir para página inicial"
            >
              <div className="logo-container">
                <img 
                  src="/Logo-Sereno3.png" 
                  alt="Sereno Logo" 
                  className="logo-image group-hover:scale-105"
                  loading="eager"
                  width="48"
                  height="48"
                />
              </div>
              <span className="logo-text group-hover:text-white/90 mr-10">Sereno</span>
            </button>
            
            {/* Search Bar */}
            <div className="search-container ml-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Pesquisar posts, grupos, pessoas..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  variant="glass"
                  size="sm"
                  radius="xl"
                  className="w-80"
                  leftIcon={Search}
                  onLeftIconClick={() => handleSearch({ preventDefault: () => {} })}
                  aria-label="Pesquisar na plataforma"
                />
              </form>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="show-desktop flex items-center space-x-5">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.tab)}
                  className={`btn-icon group ${activeTab === item.tab ? 'btn-icon-active' : ''}`}
                  aria-label={`Navegar para ${item.name}`}
                  aria-current={activeTab === item.tab ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </button>
              ))}
              
              {/* Notifications Button */}
              <button
                onClick={() => handleNavClick('notifications')}
                className={`btn-icon group ${activeTab === 'notifications' ? 'btn-icon-active' : ''}`}
                aria-label="Ver notificações"
                aria-current={activeTab === 'notifications' ? 'page' : undefined}
              >
                <Bell className="w-5 h-5" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="badge" aria-label={`${unreadCount} notificação${unreadCount > 1 ? 's' : ''} não lida${unreadCount > 1 ? 's' : ''}`}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Settings Button */}
              <button
                onClick={() => handleNavClick('settings')}
                className={`btn-icon group ${activeTab === 'settings' ? 'btn-icon-active' : ''}`}
                aria-label="Configurações"
                aria-current={activeTab === 'settings' ? 'page' : undefined}
              >
                <Settings className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Help Button */}
              <button
                onClick={onStartTour}
                className="btn-icon group"
                title="Iniciar tour do aplicativo"
                aria-label="Iniciar tour do aplicativo"
              >
                <HelpCircle className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* User Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <div className="flex items-center space-x-3">
                  <button 
                    className="flex items-center space-x-3 text-white/70 hover:text-white trans"
                    onClick={toggleDropdown}
                    aria-label="Menu do usuário"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                  >
                    <User className="w-5 h-5" aria-hidden="true" />
                    <span className="hide-mobile text-sm font-light">
                      {user.displayName || 'Usuário'}
                    </span>
                  </button>
                </div>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu" role="menu">
                    <button 
                      onClick={() => {
                        navigate('/home/profile');
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item"
                      role="menuitem"
                      aria-label="Ver meu perfil"
                    >
                      <User className="w-4 h-4 mr-2" aria-hidden="true" />
                      Meu Perfil
                    </button>

                    <button 
                      onClick={() => {
                        navigate('/home/settings');
                        setIsDropdownOpen(false);
                      }}
                      className="dropdown-item"
                      role="menuitem"
                      aria-label="Configurações do perfil"
                    >
                      <Settings className="w-4 h-4 mr-2" aria-hidden="true" />
                      Configurações do Perfil
                    </button>

                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item"
                      role="menuitem"
                      aria-label="Sair da conta"
                    >
                      <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="btn-primary"
                aria-label="Fazer login"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            <div className="mobile-menu-overlay" onClick={closeAllMenus}></div>
            <div 
              id="mobile-menu"
              ref={menuRef}
              className="mobile-menu-sidebar"
              role="menu"
              aria-label="Menu de navegação móvel"
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.tab)}
                    className={`mobile-menu-item ${activeTab === item.tab ? 'text-white' : ''}`}
                    role="menuitem"
                    aria-label={`Navegar para ${item.name}`}
                    aria-current={activeTab === item.tab ? 'page' : undefined}
                  >
                    <item.icon className="w-6 h-6" aria-hidden="true" />
                    <span>{item.name}</span>
                  </button>
                ))}
                
                <button
                  onClick={() => handleNavClick('notifications')}
                  className={`mobile-menu-item ${activeTab === 'notifications' ? 'text-white' : ''}`}
                  role="menuitem"
                  aria-label="Ver notificações"
                  aria-current={activeTab === 'notifications' ? 'page' : undefined}
                >
                  <Bell className="w-6 h-6" aria-hidden="true" />
                  <span>Notificações</span>
                  {unreadCount > 0 && (
                    <span className="badge-large">{unreadCount}</span>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('settings')}
                  className={`mobile-menu-item ${activeTab === 'settings' ? 'text-white' : ''}`}
                  role="menuitem"
                  aria-label="Configurações"
                  aria-current={activeTab === 'settings' ? 'page' : undefined}
                >
                  <Settings className="w-6 h-6" aria-hidden="true" />
                  <span>Configurações</span>
                </button>

                {user && (
                  <button
                    onClick={() => handleNavClick('profile')}
                    className={`mobile-menu-item ${activeTab === 'profile' ? 'text-white' : ''}`}
                    role="menuitem"
                    aria-label="Meu perfil"
                    aria-current={activeTab === 'profile' ? 'page' : undefined}
                  >
                    <User className="w-6 h-6" aria-hidden="true" />
                    <span>Meu Perfil</span>
                  </button>
                )}

                <button
                  onClick={onStartTour}
                  className="mobile-menu-item"
                  role="menuitem"
                  aria-label="Ajuda e tour do aplicativo"
                >
                  <HelpCircle className="w-6 h-6" aria-hidden="true" />
                  <span>Ajuda e Tour</span>
                </button>
                
                {user ? (
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center mt-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-100 trans"
                    role="menuitem"
                    aria-label="Sair da conta"
                  >
                    <LogOut className="w-5 h-5 mr-2" aria-hidden="true" />
                    Sair
                  </button>
                ) : (
                  <button 
                    onClick={() => navigate('/login')}
                    className="mt-4 px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-all "
                    role="menuitem"
                    aria-label="Fazer login"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;