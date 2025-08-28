import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Plus, 
  Check, 
  ArrowLeft,
  Sparkles,
  Clock,
  Star,
  Globe,
  Lock
} from 'lucide-react';

const ExploreCommunities = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular'); // popular, recent, alphabetical
  const [loading, setLoading] = useState(true);
  const [userCommunities, setUserCommunities] = useState([]);

  // Mock data para comunidades
  const mockCommunities = [
    {
      id: 1,
      name: "Ansiedade ",
      description: "Um espaço seguro para compartilhar experiências sobre ansiedade e encontrar apoio mútuo. Dicas, técnicas de respiração e muito mais.",
      icon: "🧘",
      memberCount: 1250,
      category: "mental-health",
      isPrivate: false,
      createdAt: new Date(2023, 5, 15),
      tags: ["ansiedade", "bem-estar", "respiração", "mindfulness"],
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      moderators: ["Dr. Ana Silva", "Psic. Carlos Santos"],
      rules: ["Seja respeitoso", "Não dê conselhos médicos", "Compartilhe experiências pessoais"]
    },
    {
      id: 2,
      name: "Apoio Emocional",
      description: "Comunidade de apoio para pessoas que lidam com depressão. Aqui você não está sozinho(a).",
      icon: "🌱",
      memberCount: 980,
      category: "mental-health",
      isPrivate: false,
      createdAt: new Date(2023, 4, 10),
      tags: ["depressão", "apoio", "suporte", "recovery"],
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
      moderators: ["Dra. Maria Costa"],
      rules: ["Ambiente seguro", "Sem julgamentos", "Apoio mútuo"]
    },
    {
      id: 3,
      name: "Meditação Diária",
      description: "Pratique meditação em grupo e compartilhe suas experiências de mindfulness.",
      icon: "🕯️",
      memberCount: 750,
      category: "wellness",
      isPrivate: false,
      createdAt: new Date(2023, 3, 20),
      tags: ["meditação", "mindfulness", "paz", "relaxamento"],
      lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
      moderators: ["Mestre João"],
      rules: ["Prática diária", "Compartilhe experiências", "Respeite o silêncio"]
    },
    {
      id: 4,
      name: "Relacionamentos Saudáveis",
      description: "Discussões sobre relacionamentos, comunicação e desenvolvimento pessoal.",
      icon: "💝",
      memberCount: 650,
      category: "relationships",
      isPrivate: false,
      createdAt: new Date(2023, 6, 5),
      tags: ["relacionamentos", "comunicação", "amor", "família"],
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      moderators: ["Terapeuta Ana"],
      rules: ["Respeito mútuo", "Sem ataques pessoais", "Compartilhe com responsabilidade"]
    },
    {
      id: 5,
      name: "Autoestima e Confiança",
      description: "Construindo amor próprio e confiança juntos. Exercícios práticos e apoio.",
      icon: "⭐",
      memberCount: 820,
      category: "self-improvement",
      isPrivate: false,
      createdAt: new Date(2023, 2, 12),
      tags: ["autoestima", "confiança", "amor próprio", "crescimento"],
      lastActivity: new Date(Date.now() - 45 * 60 * 1000),
      moderators: ["Coach Laura"],
      rules: ["Positividade", "Sem comparações", "Celebre conquistas"]
    },
    {
      id: 6,
      name: "Pais e Filhos",
      description: "Comunidade para pais compartilharem experiências na criação dos filhos.",
      icon: "👨‍👩‍👧‍👦",
      memberCount: 1100,
      category: "family",
      isPrivate: false,
      createdAt: new Date(2023, 1, 8),
      tags: ["paternidade", "filhos", "educação", "família"],
      lastActivity: new Date(Date.now() - 20 * 60 * 1000),
      moderators: ["Psic. Infantil Maria"],
      rules: ["Experiências construtivas", "Sem julgamentos", "Apoio parental"]
    },
    {
      id: 7,
      name: "Carreira e Burnout",
      description: "Discussões sobre vida profissional, estresse no trabalho e equilíbrio.",
      icon: "💼",
      memberCount: 890,
      category: "career",
      isPrivate: false,
      createdAt: new Date(2023, 7, 18),
      tags: ["carreira", "burnout", "trabalho", "estresse"],
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
      moderators: ["Coach Pedro"],
      rules: ["Confidencialidade", "Apoio profissional", "Sem spam"]
    },
    {
      id: 8,
      name: "Grupo VIP - Terapia",
      description: "Grupo privado para discussões mais profundas sobre terapia e crescimento.",
      icon: "🔒",
      memberCount: 45,
      category: "therapy",
      isPrivate: true,
      createdAt: new Date(2023, 0, 25),
      tags: ["terapia", "privado", "crescimento", "suporte"],
      lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
      moderators: ["Dr. Ricardo"],
      rules: ["Máxima confidencialidade", "Aprovação necessária", "Compromisso sério"]
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas', icon: Globe },
    { id: 'mental-health', name: 'Saúde Mental', icon: '🧠' },
    { id: 'wellness', name: 'Bem-estar', icon: '🌿' },
    { id: 'relationships', name: 'Relacionamentos', icon: '💕' },
    { id: 'self-improvement', name: 'Desenvolvimento', icon: '📈' },
    { id: 'family', name: 'Família', icon: '👨‍👩‍👧‍👦' },
    { id: 'career', name: 'Carreira', icon: '💼' },
    { id: 'therapy', name: 'Terapia', icon: '🔒' }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setCommunities(mockCommunities);
      setFilteredCommunities(mockCommunities);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = communities;

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(community => community.category === selectedCategory);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        community.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Ordenar
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.memberCount - a.memberCount);
        break;
      case 'recent':
        filtered.sort((a, b) => b.lastActivity - a.lastActivity);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredCommunities(filtered);
  }, [communities, selectedCategory, searchTerm, sortBy]);

  const joinCommunity = () => {
    console.warn('Entrada em comunidades desativada neste build.');
  };

  const leaveCommunity = () => {
    console.warn('Saída de comunidades desativada neste build.');
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-3 text-white/70">Carregando comunidades...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 animation-initial animate-fade-in-up animation-delay-100">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Explorar Comunidades</h1>
            <p className="text-white/70">Encontre grupos que combinam com seus interesses</p>
          </div>
        </div>
      </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Buscar comunidades, tags, temas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-white/70" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="popular">Mais Populares</option>
                  <option value="recent">Recentes</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="mr-2">{typeof category.icon === 'string' ? category.icon : '🌐'}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {filteredCommunities.length} comunidades encontradas
            </h2>
            <p className="text-white/60 text-sm">
              {selectedCategory !== 'all' && `Categoria: ${categories.find(c => c.id === selectedCategory)?.name}`}
              {searchTerm && ` • Busca: "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => {
            const isMember = userCommunities.includes(community.id);
            
            return (
              <div
                key={community.id}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
              >
                {/* Community Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
                      {community.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white text-lg">{community.name}</h3>
                        {community.isPrivate && (
                          <Lock className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-white/60">
                        <Users className="w-4 h-4" />
                        <span>{community.memberCount.toLocaleString()} membros</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => isMember ? leaveCommunity(community.id) : joinCommunity(community.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isMember
                        ? 'bg-white hover:bg-gray-100'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                    title={isMember ? 'Sair da comunidade' : 'Entrar na comunidade'}
                  >
                    {isMember ? (
                      <Check className="w-5 h-5 text-black" />
                    ) : (
                      <Plus className="w-5 h-5 text-black" />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  {community.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {community.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/70 border border-white/20"
                    >
                      #{tag}
                    </span>
                  ))}
                  {community.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/50">
                      +{community.tags.length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-xs text-white/50">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(community.lastActivity)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-white/50">
                    <Star className="w-3 h-3" />
                    <span>Moderado</span>
                  </div>
                </div>

                {/* Moderators */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-white/50 mb-1">Moderadores:</p>
                  <div className="flex flex-wrap gap-1">
                    {community.moderators.map((mod, index) => (
                      <span
                        key={index}
                        className="text-xs text-white bg-white/10 px-2 py-1 rounded"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-white mb-2">
              Nenhuma comunidade encontrada
            </h3>
            <p className="text-white/70 mb-6">
              Tente ajustar seus filtros ou termo de busca
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Não encontrou o que procura?
          </h3>
          <p className="text-white/70 mb-4">
            Sugira uma nova comunidade ou entre em contato conosco
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Sugerir Comunidade
            </button>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg font-medium transition-colors">
              Entrar em Contato
            </button>
          </div>
        </div>
      </div>
  );
};

export default ExploreCommunities;
