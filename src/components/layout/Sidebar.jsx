import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCommunities } from '../../hooks/useFirestore';
import CommunityCard from '../communities/CommunityCard';
import MoodRecorder from '../mood/MoodRecorder';
import MoodChart from '../mood/MoodChart';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';
import { Users, TrendingUp } from 'lucide-react';

const LeftSidebar = () => {
  const { user } = useAuth();
  const { communities, loading, joinCommunity, leaveCommunity } = useCommunities();

  const suggestedCommunities = communities
    .filter(community => !community.members?.includes(user?.uid))
    .slice(0, 3);

  return (
    <aside className="space-y-6">
      {/* Suggested Communities */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-white/80" />
          <h2 className="text-lg font-semibold text-white">Grupos Sugeridos</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-3 text-white/70">Carregando...</span>
          </div>
        ) : suggestedCommunities.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum grupo disponível"
            description="Todos os grupos já foram explorados!"
            variant="muted"
          />
        ) : (
          <div className="space-y-4">
            {suggestedCommunities.map((community) => (
              <div key={community.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                      {community.icon || community.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{community.name}</h4>
                      <p className="text-white/60 text-xs">{community.memberCount} membros</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => joinCommunity(community.id, user?.uid)}
                    disabled={!user}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-white/90 flex items-center justify-center transition-colors"
                  >
                    <Users className="w-4 h-4 text-black" />
                  </button>
                </div>
                
                <p className="text-white/70 text-xs line-clamp-2">
                  {community.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

const RightSidebar = ({ onMoodRecorded }) => {
  return (
    <aside className="space-y-6">
      {/* Mood Recorder */}
      <MoodRecorder onMoodRecorded={onMoodRecorded} />
      
      {/* Mood Chart */}
      <MoodChart />
    </aside>
  );
};

export { LeftSidebar, RightSidebar };