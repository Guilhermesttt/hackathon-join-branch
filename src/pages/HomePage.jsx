@@ .. @@
 import React from 'react';
-import WelcomeScreen from '../Components/WelcomeScreen';
-import PostCreation from '../Components/PostCreation';
-import SocialFeed from '../Components/SocialFeed';
+import WelcomeScreen from '../components/WelcomeScreen';
+import PostsList from '../components/posts/PostsList';

 function HomePage() {
   return (
     <>
       <WelcomeScreen />
-      <PostCreation />
-      <SocialFeed />
+      <PostsList />
     </>
   );
 }

 export default HomePage;