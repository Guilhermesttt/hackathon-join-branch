import React, { useState } from 'react';
import { User, UserPlus, UserMinus, MessageCircle, MoreVertical, MapPin, Calendar } from 'lucide-react';
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
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
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

  const handleMessage = () => {
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
        className="flex items-center space-x-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
        onClick={onClick}
      >
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {userData.photoURL ? (
            <img 
              src={userData.photoURL} 
              alt={userData.displayName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white/70" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white truncate">
            {userData.displayName || 'Usuário'}
          </h4>
          <p className="text-sm text-white/60 truncate">
            @{userData.username || 'usuario'}
          </p>
        </div>
        
        {showFollowButton && !isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleFollow();
            }}
            disabled={isLoading}
            className={isFollowing ? 'text-red-400 hover:text-red-300' : 'text-white/70 hover:text-white'}
          >
            {isFollowing ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className="flex items-center space-x-4 cursor-pointer flex-1"
          onClick={onClick}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
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
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-lg hover:text-white/80 transition-colors">
              {userData.displayName || 'Usuário'}
            </h3>
            <p className="text-white/60 mb-1">
              @{userData.username || 'usuario'}
            </p>
            
            {userData.bio && (
              <p className="text-white/70 text-sm line-clamp-2">
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
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="space-y-2 mb-4">
        {userData.location && (
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <MapPin className="w-4 h-4" />
            <span>{userData.location}</span>
          </div>
        )}
        
        {userData.createdAt && (
          <div className="flex items-center space-x-2 text-sm text-white/60">
            <Calendar className="w-4 h-4" />
            <span>Entrou em {formatJoinDate(userData.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-6 text-sm text-white/60 mb-4">
        <div>
          <span className="font-medium text-white">{userData.postCount || 0}</span>
          <span className="ml-1">posts</span>
        </div>
        <div>
          <span className="font-medium text-white">{userData.followers?.length || 0}</span>
          <span className="ml-1">seguidores</span>
        </div>
        <div>
          <span className="font-medium text-white">{userData.following?.length || 0}</span>
          <span className="ml-1">seguindo</span>
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
              {isFollowing ? 'Deixar de seguir' : 'Seguir'}
            </Button>
          )}
          
          {showMessageButton && (
            <Button
              onClick={handleMessage}
              variant="secondary"
              leftIcon={MessageCircle}
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