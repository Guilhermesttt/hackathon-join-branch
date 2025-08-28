import React from 'react';
import WelcomeScreen from '../Components/WelcomeScreen';
import PostCreation from '../Components/PostCreation';
import SocialFeed from '../Components/SocialFeed';

function HomePage() {
  return (
    <>
      <WelcomeScreen />
      <PostCreation />
      <SocialFeed />
    </>
  );
}

export default HomePage;
