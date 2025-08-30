import React, { useState } from 'react';
import { User, UserPlus, UserMinus, MessageCircle, MoreVertical, MapPin, Calendar, Check, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const UserCard = ({ 
  userData, 
  variant = 'default', 
  showFollowButton = true, 
  showMessageButton = true,
  onClick 
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(userData.isFollowing || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (!user) return;
    
    setIsLoading(true);
    try {
      // TODO: Implement follow/unfollow logic
      setIsFollowing(!isFollowing);
      console.log(isFollowing ? 'Unfollowing' : 'Following', userData.id);
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    // TODO: Navigate to direct message
    console.log('Opening message with', userData.id);
  };

  const formatJoinDate = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const isOwnProfile = user?.uid === userData.id;

  if (variant === 'compact') {
    return (
      <div 
        className="flex items-center space-x-3 p-4 bg-black border border-white/20 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-200 cursor-pointer group"
        onClick={onClick}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {userData.photoURL ? (
              <img 
                src={userData.photoURL} 
                alt={userData.displayName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white/70" />
            )}
          </div>
          {/* Online indicator */}
          {userData.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black rounded-full"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-white truncate group-hover:text-white/90 transition-colors">
              {userData.displayName || 'Usuário'}
            </h4>
            {userData.isVerified && (
              <Check className="w-4 h-4 text-white bg-white/20 rounded-full p-0.5" />
            )}
          </div>
          <p className="text-sm text-white/60 truncate">
            @{userData.username || 'usuario'}
          </p>
          {userData.mutualFollowers > 0 && (
            <p className="text-xs text-white/40">
              {userData.mutualFollowers} seguidor{userData.mutualFollowers > 1 ? 'es' : ''} em comum
            </p>
          )}
        </div>
        
        {showFollowButton && !isOwnProfile && (
          <Button
            variant={isFollowing ? "secondary" : "default"}
            size="sm"
            onClick={handleFollow}
            disabled={isLoading}
            loading={isLoading}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div 
          className="flex items-center space-x-4 cursor-pointer flex-1"
          onClick={onClick}
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
              {userData.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt={userData.displayName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-white/70" />
              )}
            </div>
            {/* Online indicator */}
            {userData.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-black rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-white text-xl hover:text-white/90 transition-colors">
                {userData.displayName || 'Usuário'}
              </h3>
              
              {userData.isVerified && (
                <Check className="w-5 h-5 text-white bg-white/20 rounded-full p-1" />
              )}
              
              {userData.isPremium && (
                <Star className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            
            <p className="text-white/60 mb-2 text-lg">
              @{userData.username || 'usuario'}
            </p>
            
            {userData.bio && (
              <p className="text-white/80 text-base leading-relaxed line-clamp-2">
                {userData.bio}
              </p>
            )}
          </div>
        </div>

        {!isOwnProfile && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="space-y-3 mb-6">
        {userData.location && (
          <div className="flex items-center space-x-2 text-white/60">
            <MapPin className="w-4 h-4" />
            <span>{userData.location}</span>
          </div>
        )}
        
        {userData.createdAt && (
          <div className="flex items-center space-x-2 text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Entrou em {formatJoinDate(userData.createdAt)}</span>
          </div>
        )}

        {userData.mutualFollowers > 0 && (
          <div className="flex items-center space-x-2 text-white/60">
            <Users className="w-4 h-4" />
            <span>{userData.mutualFollowers} seguidor{userData.mutualFollowers > 1 ? 'es' : ''} em comum</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-8 text-base text-white/60 mb-6">
        <div className="text-center">
          <div className="font-bold text-white text-xl">
            {userData.postCount || 0}
          </div>
          <div className="text-sm">Posts</div>
        </div>
        <div className="text-center cursor-pointer hover:text-white transition-colors">
          <div className="font-bold text-white text-xl">
            {userData.followers?.length || 0}
          </div>
          <div className="text-sm">Seguidores</div>
        </div>
        <div className="text-center cursor-pointer hover:text-white transition-colors">
          <div className="font-bold text-white text-xl">
            {userData.following?.length || 0}
          </div>
          <div className="text-sm">Seguindo</div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isOwnProfile && (
        <div className="flex space-x-3">
          {showFollowButton && (
            <Button
              onClick={handleFollow}
              disabled={isLoading}
              loading={isLoading}
              variant={isFollowing ? 'secondary' : 'default'}
              className="flex-1"
              leftIcon={isFollowing ? UserMinus : UserPlus}
            >
              {isFollowing ? 'Seguindo' : 'Seguir'}
            </Button>
          )}
          
          {showMessageButton && (
            <Button
              onClick={handleMessage}
              variant="secondary"
              leftIcon={MessageCircle}
              className="flex-1"
            >
              Mensagem
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;