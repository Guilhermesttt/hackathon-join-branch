import React from 'react';
import MainNavigation from './MainNavigation';
import FollowSuggestions from '../social/FollowSuggestions';
import TrendingTopics from '../social/TrendingTopics';

const SocialLayout = ({ children, showSidebars = true, sidebarContent = null }) => {
  return (
    <div className="min-h-screen bg-black">
      {/* Main Navigation */}
      <MainNavigation />

      {/* Main Content Area */}
      <div className="lg:ml-64 lg:mr-80 min-h-screen">
        <main className="max-w-2xl mx-auto px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>

      {/* Right Sidebar */}
      {showSidebars && (
        <aside className="hidden lg:block fixed right-0 top-0 h-full w-80 bg-black border-l border-white/20 p-6 overflow-y-auto">
          <div className="space-y-6">
            {sidebarContent || (
              <>
                <FollowSuggestions />
                <TrendingTopics />
              </>
            )}
          </div>
        </aside>
      )}

      {/* Mobile spacing for bottom navigation */}
      <div className="lg:hidden h-20" />
    </div>
  );
};

export default SocialLayout;