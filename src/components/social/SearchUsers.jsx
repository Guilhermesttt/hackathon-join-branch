import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, User, MessageCircle, Users, Hash, TrendingUp, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import UserCard from './UserCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const SearchUsers = ({ onResultSelect, className }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeFilter, setActiveFilter] = useState('all');
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Mock search results
  const mockUsers = [
    {
      id: 'user1',
      displayName: 'Ana Silva',
      username: 'ana_silva',
      bio: 'Psicóloga especializada em ansiedade e bem-estar mental',
      photoURL: null,
      location: 'São Paulo, SP',
      followers: ['user2', 'user3'],
      following: ['user4'],
      postCount: 47,
      isVerified: true,
      isOnline: true,
      mutualFollowers: 3
    },
    {
      id: 'user2',
      displayName: 'Carlos Santos',
      username: 'carlos_santos',
      bio: 'Compartilhando minha jornada de autoconhecimento',
      photoURL: null,
      location: 'Rio de Janeiro, RJ',
      followers: ['user1', 'user3'],
      following: ['user1'],
      postCount: 32,
      isVerified: false,
      isOnline: false,
      mutualFollowers: 1
    },
    {
      id: 'user3',
      displayName: 'Maria Costa',
      username: 'maria_costa',
      bio: 'Terapeuta especializada em EMDR e trauma',
      photoURL: null,
      location: 'Belo Horizonte, MG',
      followers: ['user1', 'user2'],
      following: ['user1', 'user2'],
      postCount: 58,
      isVerified: true,
      isOnline: true,
      mutualFollowers: 2
    }
  ];

  const mockCommunities = [
    {
      id: 'comm1',
      name: 'Ansiedade & Bem-estar',
      description: 'Grupo de apoio para gerenciar ansiedade',
      memberCount: 1247,
      isPrivate: false,
      tags: ['ansiedade', 'bem-estar']
    },
    {
      id: 'comm2',
      name: 'Meditação Diária',
      description: 'Pratique meditação em grupo',
      memberCount: 892,
      isPrivate: false,
      tags: ['meditação', 'mindfulness']
    }
  ];

  const mockPosts = [
    {
      id: 'post1',
      content: 'Dica incrível sobre mindfulness que mudou minha vida...',
      author: 'Ana Silva',
      likes: 45,
      commentCount: 12,
      tags: ['mindfulness', 'dica']
    }
  ];

  // Debounced search function
  const searchDebounced = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim() || searchTerm.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));

        let searchResults = [];

        if (activeFilter === 'all' || activeFilter === 'users') {
          const filteredUsers = mockUsers.filter(user =>
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.bio.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(user => ({ ...user, type: 'user' }));
          
          searchResults = [...searchResults, ...filteredUsers];
        }

        if (activeFilter === 'all' || activeFilter === 'communities') {
          const filteredCommunities = mockCommunities.filter(community =>
            community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            community.description.toLowerCase().includes(searchTerm.toLowerCase())
          ).map(community => ({ ...community, type: 'community' }));
          
          searchResults = [...searchResults, ...filteredCommunities];
        }

        if (activeFilter === 'all' || activeFilter === 'posts') {
          const filteredPosts = mockPosts.filter(post =>
            post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          ).map(post => ({ ...post, type: 'post' }));
          
          searchResults = [...searchResults, ...filteredPosts];
        }

        setResults(searchResults);
        setShowResults(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [activeFilter]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchDebounced(value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
    onResultSelect?.(result);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setSelectedIndex(-1);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getResultIcon = (type) => {
    switch (type) {
      case 'user':
        return User;
      case 'community':
        return Users;
      case 'post':
        return MessageCircle;
      default:
        return Search;
    }
  };

  const getResultLabel = (type) => {
    switch (type) {
      case 'user':
        return 'Usuário';
      case 'community':
        return 'Comunidade';
      case 'post':
        return 'Post';
      default:
        return 'Resultado';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="bg-black border border-white/20 rounded-2xl p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Search className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">Buscar</h2>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder="Pesquisar usuários, grupos, posts..."
            className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
          />
          
          {query && (
            <Button
              onClick={clearSearch}
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {/* Search Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Tudo', icon: Search },
            { id: 'users', label: 'Usuários', icon: User },
            { id: 'communities', label: 'Grupos', icon: Users },
            { id: 'posts', label: 'Posts', icon: MessageCircle }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setActiveFilter(filterOption.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === filterOption.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              <filterOption.icon className="w-4 h-4" />
              <span>{filterOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/20 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="p-6 text-center text-white/60">
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-3">Pesquisando...</span>
                </div>
              ) : (
                <div>
                  <Search className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p>Nenhum resultado encontrado</p>
                  <p className="text-sm text-white/40 mt-1">Tente termos diferentes</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = getResultIcon(result.type);
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultSelect(result)}
                    className={`w-full px-6 py-4 text-left hover:bg-white/10 transition-colors flex items-center space-x-4 ${
                      isSelected ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      {result.type === 'user' && result.photoURL ? (
                        <img 
                          src={result.photoURL} 
                          alt={result.displayName} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Icon className="w-6 h-6 text-white/70" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-bold text-white truncate text-lg">
                          {result.type === 'user' ? result.displayName : 
                           result.type === 'community' ? result.name : 
                           result.author}
                        </p>
                        <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full font-medium">
                          {getResultLabel(result.type)}
                        </span>
                      </div>
                      
                      <p className="text-base text-white/60 truncate">
                        {result.type === 'user' 
                          ? `@${result.username || 'usuario'}`
                          : result.type === 'community'
                          ? result.description
                          : result.content.substring(0, 100) + '...'
                        }
                      </p>
                      
                      {result.type === 'user' && result.mutualFollowers > 0 && (
                        <p className="text-sm text-white/50 mt-1">
                          {result.mutualFollowers} seguidor{result.mutualFollowers > 1 ? 'es' : ''} em comum
                        </p>
                      )}
                      
                      {result.type === 'community' && (
                        <p className="text-sm text-white/50 mt-1">
                          {result.memberCount} membros
                        </p>
                      )}
                      
                      {result.type === 'post' && (
                        <div className="flex items-center space-x-4 text-sm text-white/50 mt-1">
                          <span>{result.likes} curtidas</span>
                          <span>{result.commentCount} comentários</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Action */}
                    {result.type === 'user' && result.id !== user?.uid && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Quick follow
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <UserPlus className="w-4 h-4" />
                      </Button>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Trending Searches */}
      {!query && !showResults && (
        <div className="bg-black border border-white/20 rounded-2xl p-6 mt-4">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-white/80" />
            <h3 className="text-lg font-bold text-white">Tendências</h3>
          </div>
          
          <div className="space-y-3">
            {[
              { term: 'ansiedade', count: '1.2k posts' },
              { term: 'meditação', count: '890 posts' },
              { term: 'terapia', count: '654 posts' },
              { term: 'bem-estar', count: '432 posts' }
            ].map((trend, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(trend.term);
                  searchDebounced(trend.term);
                }}
                className="w-full text-left p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white group-hover:text-white/90">
                      #{trend.term}
                    </p>
                    <p className="text-sm text-white/60">
                      {trend.count}
                    </p>
                  </div>
                  <TrendingUp className="w-4 h-4 text-white/40 group-hover:text-white/60" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default SearchUsers;