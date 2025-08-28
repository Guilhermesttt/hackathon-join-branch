@@ .. @@
 import React, { useState, useEffect, useCallback, useMemo } from 'react';
 import { useNavigate } from 'react-router-dom';
-import Header from './components/Header';
-import WelcomeScreen from './Components/WelcomeScreen';
-import PostCreation from './Components/PostCreation';
-import SocialFeed from './Components/SocialFeed';
-import SuggestedGroups from './Components/SuggestedGroups';
-import MoodTracker from './Components/MoodTracker';
-import TherapySessions from './Components/TherapySessions';
-import InteractiveDiary from './Components/InteractiveDiary';
-import HumorTracker from './Components/HumorTracker';
-import LiveChat from './Components/LiveChat';
-import Settings from './Components/Settings';
-import Notifications from './Components/Notifications';
-import WelcomeTour from './Components/WelcomeTour';
+import Header from './Components/Header';
+import WelcomeScreen from './Components/WelcomeScreen';
+import PostsList from './components/posts/PostsList';
+import { LeftSidebar, RightSidebar } from './components/layout/Sidebar';
+import TherapySessions from './Components/TherapySessions';
+import InteractiveDiary from './Components/InteractiveDiary';
+import HumorTracker from './Components/HumorTracker';
+import LiveChat from './Components/LiveChat';
+import Settings from './Components/Settings';
+import Notifications from './Components/Notifications';
+import WelcomeTour from './Components/WelcomeTour';
 import { useAuth } from './contexts/AuthContext';
 import Profile from './Components/Profile';
 import FloatingParticles from './Components/FloatingParticles';
 import LightWaves from './Components/LightWaves';
 import CommunityGroups from './Components/CommunityGroups';
 import NotificationToast from './Components/NotificationToast';
 import PsychologistDashboard from './Components/PsychologistDashboard';

@@ .. @@
   const renderMainContent = () => {
     // Se o usuário for psicólogo e estiver na aba home, mostrar dashboard específico
     if (activeTab === 'home' && user?.role === 'psychologist') {
       return <PsychologistDashboard />;
     }

     switch (activeTab) {
       case 'home':
         return (
           <>
             <WelcomeScreen showWelcomeMessage={showWelcomeMessage} />
-            <PostCreation />
-            <SocialFeed />
+            <PostsList />
           </>
         );
@@ .. @@
         <>
           {/* Left Sidebar - Suggested Groups */}
           <aside className="lg:col-span-3">
             <div className="sticky top-24">
-              <SuggestedGroups setActiveTab={setActiveTab} />
+              <LeftSidebar />
             </div>
           </aside>

           {/* Main Content Area */}
           <section className="lg:col-span-6 space-y-8">
             {renderMainContent()}
           </section>

           {/* Right Sidebar - Mood Tracker */}
           <aside className="lg:col-span-3">
             <div className="sticky top-24">
-              <MoodTracker onOpenHumorTab={(tab = 'scheduling') => {
+              <RightSidebar onMoodRecorded={() => {
+                // Refresh mood data when new mood is recorded
+                console.log('Mood recorded, refreshing data...');
+              }} />
+            </div>
+          </aside>
+        </>
+      );
+    } else if (activeTab === 'profile') {
+      return (
+        <section className="lg:col-span-12">
+          <div className="max-w-6xl mx-auto">
+            {renderMainContent()}
+          </div>
+        </section>
+      );
+    } else {
+      return (
+        <section className="lg:col-span-12">
+          <div className="max-w-4xl mx-auto">
+            {renderMainContent()}
+          </div>
+        </section>
+      );
+    }
+  };

+  const handleMoodRecorded = useCallback(() => {
+    // Handle mood recorded event
+    console.log('Mood recorded successfully');
+  }, []);

+  return (
+    <>
+      <LightWaves />
+      <div className="min-h-screen bg-black lg:pb-8 pb-20">
+        <Header activeTab={activeTab} setActiveTab={setActiveTab} onStartTour={handleStartTour} />
+      
+        {/* Main Content */}
+        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
+          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
+            {renderSidebar()}
+          </div>
+        </main>

+        {/* Welcome Tour */}
+        <WelcomeTour 
+          isOpen={showTour} 
+          onClose={handleCloseTour}
+          userRole={user?.role || 'cliente'}
+          isFirstTime={isFirstTime}
+        />

+        {/* Welcome Notification */}
+        <NotificationToast
+          message="Bem-vindo ao Sereno! 🎉 Estamos felizes em tê-lo conosco nesta jornada de autoconhecimento e bem-estar."
+          type="success"
+          duration={8000}
+          isVisible={showWelcomeNotification}
+          onClose={handleCloseWelcomeNotification}
+        />
+      </div>
+    </>
+  );
+}

+export default Home;