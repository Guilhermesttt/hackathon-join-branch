import React, { useState } from 'react';
import SocialLayout from '../components/layout/SocialLayout';
import CreatePost from '../components/social/CreatePost';
import SocialFeed from '../components/social/SocialFeed';
import { Plus } from 'lucide-react';
import Button from '../components/ui/Button';

const SocialHomePage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);

  const handlePostCreated = (postData) => {
    setShowCreatePost(false);
    // Post will be automatically added to feed via the hook
    console.log('Post created:', postData);
  };

  return (
    <SocialLayout>
      <div className="space-y-6">
        {/* Create Post Section */}
        <div className="bg-black border border-white/20 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
              {/* User avatar will be populated by auth context */}
            </div>
            
            <button
              onClick={() => setShowCreatePost(true)}
              className="flex-1 text-left px-6 py-4 bg-white/5 border border-white/20 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              O que você está pensando?
            </button>
            
            <Button
              onClick={() => setShowCreatePost(true)}
              variant="default"
              leftIcon={Plus}
            >
              Postar
            </Button>
          </div>
        </div>

        {/* Expandable Create Post */}
        {showCreatePost && (
          <CreatePost 
            onPostCreated={handlePostCreated}
            className="border-2 border-white/30"
          />
        )}

        {/* Social Feed */}
        <SocialFeed />
      </div>
    </SocialLayout>
  );
};

export default SocialHomePage;