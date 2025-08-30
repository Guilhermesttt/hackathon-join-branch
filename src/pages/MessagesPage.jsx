import React from 'react';
import SocialLayout from '../components/layout/SocialLayout';
import DirectMessages from '../components/social/DirectMessages';

const MessagesPage = () => {
  return (
    <SocialLayout showSidebars={false}>
      <div className="max-w-6xl mx-auto">
        <DirectMessages />
      </div>
    </SocialLayout>
  );
};

export default MessagesPage;