import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, User, MessageCircle, Users } from 'lucide-react';
import { usersService, postsService, communitiesService } from '../../services/firestoreService';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const SearchBar = ({ onResultSelect, className }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

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
        const [users, communities] = await Promise.all([
          usersService.searchUsers(searchTerm, 5),
          communitiesService.getCommunities(10)
        ]);

        // Filter communities by search term
        const filteredCommunities = communities.filter(community =>
          community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          community.description.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);

        const searchResults = [
          ...users.map(user => ({ ...user, type: 'user' })),
          ...filteredCommunities.map(community => ({ ...community, type: 'community' }))
        ];

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
    []
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
      default:
        return MessageCircle;
    }
  };

  const getResultLabel = (type) => {
    switch (type) {
      case 'user':
        return 'Usuário';
      case 'community':
        return 'Comunidade';
      default:
        return 'Post';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Pesquisar posts, grupos, pessoas..."
          className="w-full pl-10 pr-10 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
        />
        
        {query && (
          <Button
            onClick={clearSearch}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <LoadingSpinner size="sm" />
          </div>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-white/60">
              {loading ? 'Pesquisando...' : 'Nenhum resultado encontrado'}
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
                    className={`w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center space-x-3 ${
                      isSelected ? 'bg-white/10' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      {result.type === 'user' && result.photoURL ? (
                        <img 
                          src={result.photoURL} 
                          alt={result.displayName} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <Icon className="w-5 h-5 text-white/70" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white truncate">
                          {result.type === 'user' ? result.displayName : result.name}
                        </p>
                        <span className="px-2 py-1 bg-white/20 text-white/70 text-xs rounded-full">
                          {getResultLabel(result.type)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-white/60 truncate">
                        {result.type === 'user' 
                          ? `@${result.username || 'usuario'}`
                          : result.description
                        }
                      </p>
                      
                      {result.type === 'community' && (
                        <p className="text-xs text-white/50">
                          {result.memberCount} membros
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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

export default SearchBar;