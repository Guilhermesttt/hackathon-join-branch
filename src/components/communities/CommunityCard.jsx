import React, { useState } from 'react';
import { Users, Lock, Globe, Star, Plus, Check, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCommunities } from '../../hooks/useFirestore';
import Button from '../ui/Button';

const CommunityCard = ({ community, onJoin, onLeave }) => {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const isMember = community.members?.includes(user?.uid) || false;
  const membershipPercentage = (community.memberCount / community.maxMembers) * 100;

  const handleJoinLeave = async () => {
    if (!user) {
      alert('Você precisa estar logado para participar de comunidades.');
      return;
    }

    if (isMember) {
      setIsLeaving(true);
      try {
        await onLeave(community.id, user.uid);
      } catch (error) {
        console.error('Error leaving community:', error);
        alert('Erro ao sair da comunidade. Tente novamente.');
      } finally {
        setIsLeaving(false);
      }
    } else {
      setIsJoining(true);
      try {
        await onJoin(community.id, user.uid);
      } catch (error) {
        console.error('Error joining community:', error);
        alert('Erro ao entrar na comunidade. Tente novamente.');
      } finally {
        setIsJoining(false);
      }
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl">
            {community.icon || community.name.charAt(0)}
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">
                {community.name}
              </h3>
              
              {community.isPrivate ? (
                <Lock className="w-4 h-4 text-yellow-400" />
              ) : (
                <Globe className="w-4 h-4 text-green-400" />
              )}
              
              {community.isFeatured && (
                <Star className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <Users className="w-4 h-4" />
              <span>{community.memberCount.toLocaleString()} membros</span>
              {community.maxMembers && (
                <span className="text-white/40">
                  / {community.maxMembers.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Membership Status */}
        {isMember && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
            Membro
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
        {community.description}
      </p>

      {/* Tags */}
      {community.tags && community.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {community.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full border border-white/20"
            >
              #{tag}
            </span>
          ))}
          {community.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/5 text-white/50 text-xs rounded-full">
              +{community.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Membership Progress */}
      {community.maxMembers && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>Membros</span>
            <span>{Math.round(membershipPercentage)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(membershipPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-white/60 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>{community.postCount || 0} posts</span>
          </div>
          
          {community.rating && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{community.rating}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex space-x-2">
        <Button
          onClick={handleJoinLeave}
          disabled={isJoining || isLeaving}
          loading={isJoining || isLeaving}
          variant={isMember ? 'secondary' : 'default'}
          className="flex-1"
          leftIcon={isMember ? Check : Plus}
        >
          {isMember ? 'Sair do Grupo' : 'Entrar no Grupo'}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // TODO: Navigate to community page
            console.log('View community:', community.id);
          }}
        >
          Ver Detalhes
        </Button>
      </div>
    </div>
  );
};

export default CommunityCard;