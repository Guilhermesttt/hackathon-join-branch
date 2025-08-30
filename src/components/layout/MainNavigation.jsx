import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  MessageCircle, 
  Bell, 
  User, 
  Plus, 
  Menu, 
  X,
  Settings,
  LogOut,
  Users,
  TrendingUp,
  Bookmark,
  Heart
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useFirestore';
import Button from '../ui/Button';

const MainNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuth();
  const { unreadCount } = useNotifications(user?.uid);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigationItems = [
    { 
      id: 'home', 
      label: 'Início', 
      icon: Home, 
      path: '/home',
      badge: null
    },
    { 
      id: 'search', 
      label: 'Buscar', 
      icon: Search, 
      path: '/search',
      badge: null
    },
    { 
      id: 'messages', 
      label: 'Mensagens', 
      icon: MessageCircle, 
      path: '/messages',
      badge: 3 // Mock unread messages
    },
    { 
      id: 'notifications', 
      label: 'Notificações', 
      icon: Bell, 
      path: '/notifications',
      badge: unreadCount
    },
    { 
      id: 'profile', 
      label: 'Perfil', 
      icon: User, 
      path: '/profile',
      badge: null
    }
  ];

  const secondaryItems = [
    { id: 'explore', label: 'Explorar', icon: TrendingUp, path: '/explore' },
    { id: 'communities', label: 'Comunidades', icon: Users, path: '/communities' },
    { id: 'bookmarks', label: 'Salvos', icon: Bookmark, path: '/bookmarks' },
    { id: 'liked', label: 'Curtidas', icon: Heart, path: '/liked' }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleCreatePost = () => {
    // TODO: Open create post modal
    console.log('Opening create post modal');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!setIsMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu') && !event.target.closest('.user-menu-button')) {
        setShowUserMenu(false);
      }
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-black lg:border-r lg:border-white/20 lg:p-6 lg:z-40">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <img 
              src="/Logo-Sereno3.png" 
              alt="Sereno Logo" 
              className="w-full h-full object-contain p-1"
            />
          </div>
          <span className="text-xl font-bold text-white">Sereno</span>
        </div>

        {/* Primary Navigation */}
        <div className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                isActive(item.path)
                  ? 'bg-white text-black font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-lg">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1 mb-8">
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-4 px-4 py-2 rounded-xl transition-all duration-200 text-left ${
                isActive(item.path)
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Create Post Button */}
        <Button
          onClick={handleCreatePost}
          className="w-full mb-8 py-4 text-lg font-bold"
          leftIcon={Plus}
        >
          Criar Post
        </Button>

        {/* User Menu */}
        <div className="mt-auto">
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="user-menu-button w-full flex items-center space-x-3 p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white/70" />
                )}
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">{user?.displayName || 'Usuário'}</p>
                <p className="text-sm text-white/60">@{user?.username || 'usuario'}</p>
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="user-menu absolute bottom-full left-0 right-0 mb-2 bg-black border border-white/20 rounded-xl shadow-2xl py-2">
                <button
                  onClick={() => {
                    handleNavigation('/profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-3"
                >
                  <User className="w-5 h-5" />
                  <span>Meu Perfil</span>
                </button>
                <button
                  onClick={() => {
                    handleNavigation('/settings');
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-3"
                >
                  <Settings className="w-5 h-5" />
                  <span>Configurações</span>
                </button>
                <hr className="border-white/20 my-2" />
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-3"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {navigationItems.slice(0, 4).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-button flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 text-white/60 hover:text-white"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="mobile-menu lg:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-white/20 rounded-t-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Menu</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl mb-6">
              <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-white/70" />
                )}
              </div>
              <div>
                <p className="font-bold text-white">{user?.displayName || 'Usuário'}</p>
                <p className="text-sm text-white/60">@{user?.username || 'usuario'}</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-2 mb-6">
              {[...navigationItems, ...secondaryItems].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-left text-white/70 hover:text-white hover:bg-white/10"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-white text-black text-xs font-bold rounded-full px-2 py-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Create Post Button */}
            <Button
              onClick={handleCreatePost}
              className="w-full mb-6 py-4 text-lg font-bold"
              leftIcon={Plus}
            >
              Criar Post
            </Button>

            {/* Settings and Logout */}
            <div className="space-y-2 pt-4 border-t border-white/20">
              <button
                onClick={() => handleNavigation('/settings')}
                className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-left text-white/70 hover:text-white hover:bg-white/10"
              >
                <Settings className="w-6 h-6" />
                <span className="text-lg">Configurações</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-lg">Sair</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainNavigation;