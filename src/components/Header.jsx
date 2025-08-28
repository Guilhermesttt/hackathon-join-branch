@@ .. @@
 import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
 import { Search, Home, MessageCircle, Calendar, BarChart3, Settings, Menu, X, Bell, BookOpen, HelpCircle, User, LogOut } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
-import { useNotifications } from '../hooks/useNotifications';
-import Input from '../Components/ui/Input';
+import { useNotifications } from '../hooks/useFirestore';
+import SearchBar from './search/SearchBar';
+import Input from './ui/Input';

 const Header = React.memo(({ activeTab, setActiveTab, onStartTour }) => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
-  const [searchQuery, setSearchQuery] = useState('');
   const { user, loading } = useAuth();
-  const { unreadCount } = useNotifications();
+  const { unreadCount } = useNotifications(user?.uid);
   const navigate = useNavigate();
@@ .. @@
             
             {/* Search Bar */}
             <div className="search-container ml-8">
-              <form onSubmit={handleSearch} className="relative">
-                <Input
-                  ref={searchInputRef}
-                  type="text"
-                  placeholder="Pesquisar posts, grupos, pessoas..."
-                  value={searchQuery}
-                  onChange={handleSearchChange}
-                  variant="glass"
-                  size="sm"
-                  radius="xl"
-                  className="w-80"
-                  leftIcon={Search}
-                  onLeftIconClick={() => handleSearch({ preventDefault: () => {} })}
-                  aria-label="Pesquisar na plataforma"
-                />
-              </form>
+              <SearchBar 
+                onResultSelect={handleSearchResult}
+                className="w-80"
+              />
             </div>
           </div>

@@ .. @@
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

-  const handleSearch = useCallback((e) => {
-    e.preventDefault();
-    if (searchQuery.trim()) {
-      // Implementar busca
-      console.log('Searching for:', searchQuery);
+  const handleSearchResult = useCallback((result) => {
+    // Handle search result selection
+    if (result.type === 'user') {
+      navigate(`/user/${result.id}`);
+    } else if (result.type === 'community') {
+      navigate(`/community/${result.id}`);
+    } else if (result.type === 'post') {
+      navigate(`/post/${result.id}`);
     }
-  }, [searchQuery]);
-
-  const handleSearchChange = useCallback((e) => {
-    setSearchQuery(e.target.value);
-  }, []);
+  }, [navigate]);