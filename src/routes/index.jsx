@@ .. @@
 import React from 'react';
 import { Navigate } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
+import { socialRoutes } from './socialRoutes';

 // Componentes de páginas
@@ .. @@
 import WelcomeTour from '../Components/WelcomeTour.jsx';

+// Import social network pages
+import SocialHomePage from '../pages/SocialHomePage';
+import SearchPage from '../pages/SearchPage';
+import MessagesPage from '../pages/MessagesPage';
+import NotificationsPage from '../pages/NotificationsPage';
+import ProfilePage from '../pages/ProfilePage';
+
 // Componente para rotas protegidas
@@ .. @@
   },

   // ===== ROTAS PRINCIPAIS (requerem perfil completo) =====
+  // Social Network Routes
+  ...socialRoutes,
+  
+  // Legacy routes (mantidas para compatibilidade)
   {
     path: '/home',
-    element: <CompleteProfileRoute><MainLayout><HomePage /></MainLayout></CompleteProfileRoute>,
+    element: <CompleteProfileRoute><SocialHomePage /></CompleteProfileRoute>,
     protected: true,
     title: 'Sereno - Home',
     category: 'main'
   },
@@ .. @@
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
-    element: <CompleteProfileRoute><MainLayout><Notifications /></MainLayout></CompleteProfileRoute>,
+    element: <CompleteProfileRoute><NotificationsPage /></CompleteProfileRoute>,
     protected: true,
     title: 'Sereno - Notificações',
     category: 'main'
   },
@@ .. @@
   },
   {
     path: '/profile',
-    element: <CompleteProfileRoute><Profile /></CompleteProfileRoute>,
+    element: <CompleteProfileRoute><ProfilePage /></CompleteProfileRoute>,
     protected: true,
     title: 'Sereno - Meu Perfil',
     category: 'main'
   },
   {
     path: '/profile/:userId',
-    element: <CompleteProfileRoute><Profile /></CompleteProfileRoute>,
+    element: <CompleteProfileRoute><ProfilePage /></CompleteProfileRoute>,
     protected: true,
     title: 'Sereno - Perfil',
     category: 'main'
   },
@@ .. @@