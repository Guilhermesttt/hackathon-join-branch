@@ .. @@
 import { StrictMode } from 'react';
 import { createRoot } from 'react-dom/client';
 import { BrowserRouter, Routes, Route } from 'react-router-dom';
 import { AuthProvider, useAuth } from './contexts/AuthContext';
 import { routes } from './routes';
+import ErrorBoundary from './components/common/ErrorBoundary';
 import './index.css';

@@ .. @@
 if (root) {
   root.render(
     <StrictMode>
-      <BrowserRouter>
-        <AuthProvider>
-          <AppContent />
-        </AuthProvider>
-      </BrowserRouter>
+      <ErrorBoundary>
+        <BrowserRouter>
+          <AuthProvider>
+            <AppContent />
+          </AuthProvider>
+        </BrowserRouter>
+      </ErrorBoundary>
     </StrictMode>
   );
 }