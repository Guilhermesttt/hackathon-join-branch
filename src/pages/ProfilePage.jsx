import React from 'react';
import { useParams } from 'react-router-dom';
import SocialLayout from '../components/layout/SocialLayout';
import UserProfile from '../components/social/UserProfile';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  
  const profileUserId = userId || user?.uid;
  const isOwnProfile = !userId || userId === user?.uid;

  return (
    <SocialLayout showSidebars={false}>
      <div className="max-w-4xl mx-auto">
        <UserProfile 
          userId={profileUserId}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </SocialLayout>
  );
};

export default ProfilePage;