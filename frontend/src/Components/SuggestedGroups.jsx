import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Plus, Check, MessageCircle, Search } from 'lucide-react';
import Confetti from './Confetti';

const SuggestedGroups = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data para desenvolvimento
  const communities = [
    {
      id: 1,
      name: "Ansiedade",
      icon: "🧘‍♀️",
      memberCount: 1250,
      description: "Compartilhe experiências e dicas para lidar com ansiedade"
    },
    {
      id: 2,
      name: "Estresse",
      icon: "🌿",
      memberCount: 980,
      description: "Um espaço seguro para falar sobre depressão"
    },
    {
      id: 3,
      name: "Autoestima",
      icon: "✨",
      memberCount: 820,
      description: "Construindo confiança e amor próprio"
    },
    {
      id: 4,
      name: "Relacionamentos",
      icon: "💝",
      memberCount: 650,
      description: "Discussões sobre relacionamentos saudáveis"
    },
    {
      id: 5,
      name: "Meditação Diária",
      icon: "🕯️",
      memberCount: 750,
      description: "Pratique meditação em grupo"
    }
  ];

  // Mock friends data
  const friends = [
    { id: 1, name: "Maria Silva", status: "Online há 2 horas", friendshipTime: "Amigos há 3 meses", avatarBg: "bg-gradient-to-r from-gray-600 to-gray-800", initial: "M", profileImage: null },
    { id: 2, name: "João Santos", status: "Online agora", friendshipTime: "Amigos há 1 mês", avatarBg: "bg-gradient-to-r from-gray-700 to-gray-900", initial: "J", profileImage: null },
    { id: 3, name: "Ana Oliveira", status: "Offline", friendshipTime: "Amigos há 2 meses", avatarBg: "bg-gradient-to-r from-gray-500 to-gray-700", initial: "A", profileImage: null },
    { id: 4, name: "Pedro Costa", status: "Online há 1 hora", friendshipTime: "Amigos há 4 meses", avatarBg: "bg-gradient-to-r from-gray-800 to-black", initial: "P", profileImage: null },
    { id: 5, name: "Carla Ferreira", status: "Offline", friendshipTime: "Amigos há 3 meses", avatarBg: "bg-gradient-to-r from-gray-600 to-gray-800", initial: "C", profileImage: null },
    { id: 6, name: "Rafael Martins", status: "Online há 30 minutos", friendshipTime: "Amigos há 2 meses", avatarBg: "bg-gradient-to-r from-gray-700 to-gray-900", initial: "R", profileImage: null },
    { id: 7, name: "Juliana Lima", status: "Offline", friendshipTime: "Amigos há 1 mês", avatarBg: "bg-gradient-to-r from-gray-800 to-black", initial: "J", profileImage: null },
    { id: 8, name: "Marcelo Santos", status: "Online há 1 hora", friendshipTime: "Amigos há 3 meses", avatarBg: "bg-gradient-to-r from-gray-600 to-gray-800", initial: "M", profileImage: null },
    { id: 9, name: "Beatriz Costa", status: "Offline", friendshipTime: "Amigos há 2 meses", avatarBg: "bg-gradient-to-r from-gray-700 to-gray-900", initial: "B", profileImage: null },
    { id: 10, name: "Lucas Oliveira", status: "Online há 20 minutos", friendshipTime: "Amigos há 1 mês", avatarBg: "bg-gradient-to-r from-gray-800 to-black", initial: "L", profileImage: null },
  ];

  const [userCommunities, setUserCommunities] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const joinCommunity = (communityId) => {
    setUserCommunities(prev => [...prev, communityId]);
    setConfettiTrigger(prev => prev + 1);
  };

  const leaveCommunity = (communityId) => {
    setUserCommunities(prev => prev.filter(id => id !== communityId));
  };

  const getPopularCommunities = (limit) => {
    return [...communities]
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit);
  };

  const popularCommunities = getPopularCommunities(5);

  // Filter friends based on search
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="loading-spinner"></div>
          <span className="ml-3 text-white/70">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Confetti trigger={confettiTrigger} />
      <div className="space-y-6 animation-initial animate-fade-in-left animation-delay-100">
        {/* Popular Communities */}
        <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative">
              <div className="w-5 h-5 text-white/80">
                <Users className="w-5 h-5" />
              </div>
              <div className="absolute -inset-1 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Grupos Sugeridos
            </h2>
          </div>
          
          <div className="space-y-4">
            {popularCommunities.slice(0, 3).map((community) => {
              const isMember = userCommunities.includes(community.id);
              
              return (
                <div 
                  key={community.id} 
                  className="group/item relative flex items-center justify-between p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10 hover:from-white/10 hover:to-white/15 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-white/90 flex items-center justify-center text-black font-bold text-xl shadow-lg group-hover/item:scale-110 transition-transform duration-300">
                        {community.icon}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-xl blur opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm group-hover/item:text-white/90 transition-colors">
                        {community.name}
                      </h4>
                      <p className="text-white/50 text-xs font-medium">
                        {community.memberCount.toLocaleString()} membros
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => isMember ? leaveCommunity(community.id) : joinCommunity(community.id)}
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110 hover:rotate-3 ${
                      isMember 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-lg shadow-green-500/25' 
                        : 'bg-gradient-to-br from-white to-white/90 hover:from-white/80 hover:to-white shadow-lg shadow-white/25'
                    }`}
                    title={isMember ? 'Sair da comunidade' : 'Entrar na comunidade'}
                  >
                    {isMember ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Plus className="w-5 h-5 text-black" />
                    )}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Explore More Button - Enhanced with animations */}
          <div className="text-center pt-6">
            <button 
              onClick={() => navigate('/home/groups')}
              className="px-6 py-3 bg-white text-black font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-lg hover:scale-105 transform"
            >
              Ver Comunidades
            </button>
          </div>
        </div>

        {/* Friends List - Enhanced with premium hover animations */}
        <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:border-white/30 relative overflow-hidden">
          {/* Animated background glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
          
          <div className="flex items-center space-x-3 mb-4 relative z-10">
            <div className="relative">
              <Users className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:scale-110" />
              <div className="absolute -inset-2 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-white/90 transition-all duration-300 group-hover:tracking-wide">
              Lista de Amigos
            </h3>
          </div>

          {/* Search Box - Enhanced with dynamic colors */}
          <div className="mb-4 relative z-10">
            <div className="relative group/search">
              <input
                type="text"
                placeholder="Buscar amigos..."
                className="w-full px-4 py-3 bg-transparent border border-white/10 hover:bg-white/20 focus:bg-white text-black placeholder-white/60 focus:placeholder-black/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 hover:border-white/30 focus:border-white/40"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* Search Icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className="w-4 h-4 text-white/40 group-hover/search:text-white/80 transition-all duration-300 group-hover/search:scale-110" />
              </div>
              
              {/* Clear Button - Only show when there's text */}
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer"
                  title="Limpar busca"
                >
                  <span className="text-white/80 hover:text-white text-xs font-bold">×</span>
                </button>
              )}
            </div>
            
            {/* Search Results Counter */}
            {searchTerm && (
              <div className="mt-2 text-xs text-white/60">
                {filteredFriends.length === 0 ? (
                  <span className="text-red-400">Nenhum amigo encontrado</span>
                ) : filteredFriends.length === 1 ? (
                  <span>1 amigo encontrado</span>
                ) : (
                  <span>{filteredFriends.length} amigos encontrados</span>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            {/* Friends list with ultra-enhanced animations */}
            {filteredFriends.length === 0 && searchTerm ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-8 h-8 text-white/30" />
                </div>
                <p className="text-white/50 text-sm">Nenhum amigo encontrado para "{searchTerm}"</p>
                <button
                  onClick={clearSearch}
                  className="mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 hover:text-white transition-all duration-200 text-sm"
                >
                  Limpar busca
                </button>
              </div>
            ) : (
              filteredFriends.map((friend, index) => (
                <div 
                  key={friend.id} 
                  className="group/friend relative p-3 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10 hover:from-white/15 hover:to-white/20 hover:border-white/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-white/20 transform hover:-translate-y-0.5 overflow-hidden"
                  style={{ 
                    animationDelay: `${index * 30}ms`,
                    transform: 'translateZ(0)' // Force hardware acceleration
                  }}
                >
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/friend:opacity-100 transition-opacity duration-500 group-hover/friend:animate-pulse"></div>
                  
                  {/* Floating particles effect */}
                  <div className="absolute top-2 right-2 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover/friend:opacity-100 group-hover/friend:animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white/20 rounded-full opacity-0 group-hover/friend:opacity-100 group-hover/friend:animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${friend.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover/friend:scale-105 transition-all duration-300 group-hover/friend:shadow-xl`}>
                          {friend.initial}
                        </div>
                        {/* Multiple glow layers for premium effect */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-white/5 rounded-xl blur-sm opacity-0 group-hover/friend:opacity-100 transition-all duration-500 group-hover/friend:scale-150"></div>
                        <div className="absolute -inset-1 bg-white/10 rounded-xl opacity-0 group-hover/friend:opacity-100 transition-opacity duration-300"></div>
                        {/* Pulsing ring */}
                        <div className="absolute -inset-3 border border-white/20 rounded-xl opacity-0 group-hover/friend:opacity-100 group-hover/friend:animate-pulse transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white text-sm group-hover/friend:text-white transition-all duration-300 truncate group-hover/friend:tracking-wide">
                          {friend.name}
                        </h4>
                        <p className="text-white/50 text-xs font-medium group-hover/friend:text-white/80 transition-all duration-300 truncate group-hover/friend:translate-x-0.5">
                          {friend.status}
                        </p>
                        <span className="text-white/40 text-xs font-medium group-hover/friend:text-white/70 transition-all duration-300 group-hover/friend:translate-x-0.5">
                          {friend.friendshipTime}
                        </span>
                      </div>
                    </div>
                    <button className="group/msg relative w-9 h-9 rounded-xl bg-gradient-to-br from-white to-white/90 hover:from-white/90 hover:to-white flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/30 flex-shrink-0 ml-3 overflow-hidden">
                      <MessageCircle className="w-4 h-4 text-black group-hover/msg:scale-110 transition-all duration-300 relative z-10" />
                      
                      {/* Button shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300 group-hover/msg:animate-pulse"></div>
                      
                      {/* Ripple effect */}
                      <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover/msg:scale-150 transition-transform duration-300 opacity-50"></div>
                      
                      {/* Floating sparkles */}
                      <div className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full opacity-0 group-hover/msg:opacity-100 group-hover/msg:animate-ping transition-opacity duration-300"></div>
                      <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-white/80 rounded-full opacity-0 group-hover/msg:opacity-100 group-hover/msg:animate-ping transition-opacity duration-300" style={{ animationDelay: '0.1s' }}></div>
                    </button>
                  </div>
                  
                  {/* Bottom border glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/friend:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SuggestedGroups;
