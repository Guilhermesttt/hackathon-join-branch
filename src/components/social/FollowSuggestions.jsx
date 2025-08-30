import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Sparkles, Star, Check, MessageCircle } from 'lucide-react';
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
      bio: 'Psicóloga especializada em ansiedade e bem-estar mental. Compartilhando dicas e reflexões sobre saúde mental.',
      photoURL: null,
      location: 'São Paulo, SP',
      followers: ['user2', 'user3', 'user4', 'user5'],
      following: ['user4', 'user6'],
      postCount: 47,
      isVerified: true,
      isPremium: false,
      isOnline: true,
      mutualFollowers: 3,
      reason: 'Sugerido por ter interesses similares',
      tags: ['psicologia', 'ansiedade', 'bem-estar']
    },
    {
      id: 'user2',
      displayName: 'Carlos Santos',
      username: 'carlos_santos',
      bio: 'Compartilhando minha jornada de autoconhecimento e crescimento pessoal. Meditação e mindfulness são minha paixão.',
      photoURL: null,
      location: 'Rio de Janeiro, RJ',
      followers: ['user1', 'user3', 'user5'],
      following: ['user1', 'user4'],
      postCount: 32,
      isVerified: false,
      isPremium: true,
      isOnline: false,
      mutualFollowers: 2,
      reason: 'Amigo de Ana Silva',
      tags: ['meditação', 'mindfulness', 'crescimento']
    },
    {
      id: 'user3',
      displayName: 'Maria Costa',
      username: 'maria_costa',
      bio: 'Terapeuta especializada em EMDR e trauma. Ajudando pessoas a encontrarem paz interior e cura emocional.',
      photoURL: null,
      location: 'Belo Horizonte, MG',
      followers: ['user1', 'user2', 'user4', 'user5', 'user6'],
      following: ['user1', 'user2'],
      postCount: 58,
      isVerified: true,
      isPremium: true,
      isOnline: true,
      mutualFollowers: 4,
      reason: 'Popular na sua rede',
      tags: ['terapia', 'EMDR', 'trauma', 'cura']
    },
    {
      id: 'user4',
      displayName: 'Pedro Oliveira',
      username: 'pedro_oliveira',
      bio: 'Coach de vida e bem-estar. Ajudando pessoas a descobrirem seu propósito e viverem com mais significado.',
      photoURL: null,
      location: 'Brasília, DF',
      followers: ['user2', 'user3'],
      following: ['user1', 'user2', 'user3'],
      postCount: 23,
      isVerified: false,
      isPremium: false,
      isOnline: false,
      mutualFollowers: 1,
      reason: 'Baseado na sua atividade',
      tags: ['coaching', 'propósito', 'bem-estar']
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
      <div className="bg-black border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-white/70">Carregando sugestões...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-white/20 rounded-2xl p-6">
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
      <div className="bg-black border border-white/20 rounded-2xl p-6">
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
    <div className="bg-black border border-white/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-6 h-6 text-white" />
        <h2 className="text-xl font-bold text-white">Quem seguir</h2>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
            className="flex items-start space-x-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
          >
            {/* Avatar */}
            <div 
              className="relative cursor-pointer"
              onClick={() => handleViewProfile(suggestion.id)}
            >
              <div className="w-14 h-14 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {suggestion.photoURL ? (
                  <img 
                    src={suggestion.photoURL} 
                    alt={suggestion.displayName} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-white/70" />
                )}
              </div>
              
              {/* Online indicator */}
              {suggestion.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-black rounded-full"></div>
              )}
            </div>

            {/* User Info */}
            <div 
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => handleViewProfile(suggestion.id)}
            >
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-bold text-white hover:text-white/80 transition-colors">
                  {suggestion.displayName}
                </h4>
                {suggestion.isVerified && (
                  <Check className="w-4 h-4 text-white bg-white/20 rounded-full p-0.5" />
                )}
                {suggestion.isPremium && (
                  <Star className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              
              <p className="text-sm text-white/60 mb-2">
                @{suggestion.username}
              </p>
              
              <p className="text-sm text-white/70 line-clamp-2 mb-2 leading-relaxed">
                {suggestion.bio}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-2">
                {suggestion.tags?.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-white/50">
                <span>{suggestion.followers.length} seguidores</span>
                <span>{suggestion.postCount} posts</span>
                {suggestion.mutualFollowers > 0 && (
                  <span>{suggestion.mutualFollowers} em comum</span>
                )}
              </div>
              
              <p className="text-xs text-white/40 mt-2">
                {suggestion.reason}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => handleFollowUser(suggestion.id)}
                size="sm"
                variant={suggestion.isFollowing ? 'secondary' : 'default'}
                leftIcon={suggestion.isFollowing ? Check : UserPlus}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {suggestion.isFollowing ? 'Seguindo' : 'Seguir'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white"
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-6 pt-4 border-t border-white/20">
        <Button
          variant="secondary"
          onClick={() => {
            // TODO: Navigate to explore users page
            console.log('View all suggestions');
          }}
          className="w-full"
        >
          Ver mais sugestões
        </Button>
      </div>
    </div>
  );
};

export default FollowSuggestions;