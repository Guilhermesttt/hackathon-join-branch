import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserCard from './UserCard';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const FollowSuggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for now - replace with real Firebase data
  const mockSuggestions = [
    {
      id: 'user1',
      displayName: 'Ana Silva',
      username: 'ana_silva',
      bio: 'Psicóloga especializada em ansiedade e bem-estar mental',
      photoURL: null,
      location: 'São Paulo, SP',
      followers: ['user2', 'user3'],
      following: ['user4'],
      postCount: 24,
      isVerified: true,
      mutualFollowers: ['user2'],
      reason: 'Sugerido por ter interesses similares'
    },
    {
      id: 'user2',
      displayName: 'Carlos Santos',
      username: 'carlos_santos',
      bio: 'Compartilhando minha jornada de autoconhecimento e crescimento pessoal',
      photoURL: null,
      location: 'Rio de Janeiro, RJ',
      followers: ['user1', 'user3'],
      following: ['user1'],
      postCount: 18,
      isVerified: false,
      mutualFollowers: ['user1'],
      reason: 'Amigo de Ana Silva'
    },
    {
      id: 'user3',
      displayName: 'Maria Costa',
      username: 'maria_costa',
      bio: 'Meditação, mindfulness e vida equilibrada 🧘‍♀️',
      photoURL: null,
      location: 'Belo Horizonte, MG',
      followers: ['user1', 'user2'],
      following: ['user1', 'user2'],
      postCount: 31,
      isVerified: false,
      mutualFollowers: ['user1', 'user2'],
      reason: 'Popular na sua rede'
    }
  ];

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filter out current user and already followed users
        const filteredSuggestions = mockSuggestions.filter(suggestion => 
          suggestion.id !== user?.uid
        );
        
        setSuggestions(filteredSuggestions);
      } catch (err) {
        setError('Erro ao carregar sugestões');
        console.error('Error loading suggestions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadSuggestions();
    }
  }, [user]);

  const handleFollowUser = async (userId) => {
    try {
      // TODO: Implement follow logic
      console.log('Following user:', userId);
      
      // Update local state
      setSuggestions(prev => 
        prev.map(suggestion => 
          suggestion.id === userId 
            ? { ...suggestion, isFollowing: true }
            : suggestion
        )
      );
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleViewProfile = (userId) => {
    // TODO: Navigate to user profile
    console.log('Viewing profile:', userId);
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-white/70">Carregando sugestões...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <EmptyState
          icon={Users}
          title="Erro ao carregar"
          description={error}
          variant="muted"
        />
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <EmptyState
          icon={Users}
          title="Nenhuma sugestão"
          description="Você já segue todos os usuários sugeridos!"
          variant="muted"
        />
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-white/80" />
        <h2 className="text-lg font-semibold text-white">Quem seguir</h2>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
            className="flex items-center space-x-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            {/* Avatar */}
            <div 
              className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer"
              onClick={() => handleViewProfile(suggestion.id)}
            >
              {suggestion.photoURL ? (
                <img 
                  src={suggestion.photoURL} 
                  alt={suggestion.displayName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 text-white/70" />
              )}
            </div>

            {/* User Info */}
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => handleViewProfile(suggestion.id)}
            >
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-white hover:text-white/80 transition-colors">
                  {suggestion.displayName}
                </h4>
                {suggestion.isVerified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-white/60 truncate">
                @{suggestion.username}
              </p>
              
              {suggestion.mutualFollowers?.length > 0 && (
                <p className="text-xs text-white/50 mt-1">
                  {suggestion.mutualFollowers.length} seguidor{suggestion.mutualFollowers.length > 1 ? 'es' : ''} em comum
                </p>
              )}
              
              <p className="text-xs text-white/40 mt-1">
                {suggestion.reason}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleFollowUser}
                disabled={isLoading}
                size="sm"
                variant={suggestion.isFollowing ? 'secondary' : 'default'}
                leftIcon={suggestion.isFollowing ? UserMinus : UserPlus}
              >
                {suggestion.isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-6 pt-4 border-t border-white/10">
        <Button
          variant="secondary"
          onClick={() => {
            // TODO: Navigate to explore users page
            console.log('View all suggestions');
          }}
        >
          Ver mais sugestões
        </Button>
      </div>
    </div>
  );
};

export default FollowSuggestions;