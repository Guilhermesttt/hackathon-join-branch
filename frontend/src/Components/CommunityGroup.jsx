import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreVertical,
  Search,
  Filter,
  Calendar,
  MapPin,
  UserPlus,
  UserMinus,
  Settings,
  Edit3,
  Trash2,
  X
} from 'lucide-react';

const CommunityGroup = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data for now - replace with real Firebase data
  const mockGroup = {
    id: groupId,
    name: 'Ansiedade & Estresse',
    description: 'Um grupo de apoio para pessoas que lidam com ansiedade e estresse no dia a dia. Compartilhe suas experiências, receba apoio e aprenda estratégias de enfrentamento.',
    avatar: null,
    memberCount: 1247,
    postCount: 89,
    createdAt: new Date('2024-01-15'),
    rules: [
      'Respeite todos os membros',
      'Mantenha as discussões focadas no tema do grupo',
      'Não compartilhe informações pessoais de outros',
      'Seja gentil e acolhedor',
      'Reporte comportamentos inadequados'
    ],
    tags: ['ansiedade', 'estresse', 'saúde mental', 'apoio', 'bem-estar'],
    privacy: 'public',
    category: 'Saúde Mental',
    location: 'Online',
    meetingSchedule: 'Toda quarta-feira às 20h',
    admins: ['admin1', 'admin2'],
    members: ['user1', 'user2', 'user3']
  };

  const mockPosts = [
    {
      id: 1,
      author: {
        id: 'user1',
        name: 'Maria Santos',
        avatar: null
      },
      content: 'Hoje foi um dia difícil no trabalho. A ansiedade estava muito alta durante uma reunião importante. Alguém tem alguma técnica de respiração que funcione bem para vocês?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      likes: 12,
      comments: 8,
      liked: false,
      tags: ['ansiedade', 'trabalho', 'técnicas']
    },
    {
      id: 2,
      author: {
        id: 'user2',
        name: 'João Silva',
        avatar: null
      },
      content: 'Queria compartilhar uma vitória pessoal: consegui fazer uma apresentação em público sem ter um ataque de pânico! A terapia e os exercícios de mindfulness estão funcionando. Obrigado a todos pelo apoio!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: 45,
      comments: 15,
      liked: true,
      tags: ['vitória', 'mindfulness', 'terapia']
    },
    {
      id: 3,
      author: {
        id: 'user3',
        name: 'Ana Costa',
        avatar: null
      },
      content: 'Alguém já experimentou meditação guiada? Estou pensando em começar mas não sei por onde começar. Alguma recomendação de app ou canal no YouTube?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      likes: 8,
      comments: 12,
      liked: false,
      tags: ['meditação', 'dicas', 'apps']
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }

        setUser(currentUser);
        
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          
          // Check if user is member or admin
          setIsMember(mockGroup.members.includes(currentUser.uid));
          setIsAdmin(mockGroup.admins.includes(currentUser.uid));
        }

        // Set mock data for now
        setGroup(mockGroup);
        setPosts(mockPosts);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, navigate]);

  const handleJoinGroup = async () => {
    try {
      // TODO: Implement real join logic with Firebase
      setIsMember(true);
      setShowJoinModal(false);
      // Update group member count
      setGroup(prev => ({
        ...prev,
        memberCount: prev.memberCount + 1
      }));
    } catch (error) {
      console.error('Erro ao entrar no grupo:', error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      // TODO: Implement real leave logic with Firebase
      setIsMember(false);
      // Update group member count
      setGroup(prev => ({
        ...prev,
        memberCount: prev.memberCount - 1
      }));
    } catch (error) {
      console.error('Erro ao sair do grupo:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      // TODO: Implement real post creation with Firebase
      const post = {
        id: Date.now(),
        author: {
          id: user.uid,
          name: userData?.displayName || user.displayName || 'Usuário',
          avatar: user.photoURL
        },
        content: newPost,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        liked: false,
        tags: []
      };

      setPosts(prev => [post, ...prev]);
      setNewPost('');
      
      // Update group post count
      setGroup(prev => ({
        ...prev,
        postCount: prev.postCount + 1
      }));
    } catch (error) {
      console.error('Erro ao criar post:', error);
    }
  };

  const handleLikePost = (postId) => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked: !post.liked, 
              likes: post.liked 
                ? (Array.isArray(post.likes) ? post.likes.filter(id => id !== 'current-user') : [])
                : (Array.isArray(post.likes) ? [...post.likes, 'current-user'] : ['current-user'])
            }
          : post
      )
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'popular' && (Array.isArray(post.likes) ? post.likes.length : 0) > 10) ||
                         (filterType === 'recent' && post.timestamp > new Date(Date.now() - 1000 * 60 * 60 * 24));
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando grupo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-light">{group.name}</h1>
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
              <button className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Group Header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Group Avatar */}
            <div className="w-32 h-32 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
              {group.avatar ? (
                <img src={group.avatar} alt={group.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Users className="w-16 h-16 text-white/50" />
              )}
            </div>

            {/* Group Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-light mb-2">{group.name}</h2>
                  <p className="text-white/70 text-lg mb-4">{group.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-white/10 px-3 py-1 rounded-full text-sm text-white/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6 text-sm text-white/60">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{group.memberCount} membros</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{group.postCount} posts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Criado em {group.createdAt.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                  {isMember ? (
                    <button
                      onClick={handleLeaveGroup}
                      className="bg-red-600/20 border border-red-500/30 text-red-300 px-6 py-2 rounded-xl font-light hover:bg-red-600/30 transition-all duration-300"
                    >
                      <UserMinus className="w-4 h-4 inline mr-2" />
                      Sair do Grupo
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="bg-white text-black px-6 py-2 rounded-xl font-light hover:bg-white/90 transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Entrar no Grupo
                    </button>
                  )}
                  
                  <button className="bg-white/10 border border-white/30 text-white px-6 py-2 rounded-xl font-light hover:bg-white/20 transition-all duration-300">
                    <Share2 className="w-4 h-4 inline mr-2" />
                    Compartilhar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Rules */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-light mb-4">Regras do Grupo</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {group.rules.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-white/50 mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Meeting Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-light mb-4">Encontros</h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-white/50" />
                <span>{group.meetingSchedule}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-white/50" />
                <span>{group.location}</span>
              </div>
            </div>
          </div>

          {/* Group Stats */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-xl font-light mb-4">Estatísticas</h3>
            <div className="space-y-3 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Membros ativos:</span>
                <span className="text-white">1,247</span>
              </div>
              <div className="flex justify-between">
                <span>Posts esta semana:</span>
                <span className="text-white">23</span>
              </div>
              <div className="flex justify-between">
                <span>Novos membros:</span>
                <span className="text-white">+12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-light">Discussões</h3>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
              </div>

              {/* Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              >
                <option value="all">Todos</option>
                <option value="recent">Recentes</option>
                <option value="popular">Populares</option>
              </select>
            </div>
          </div>

          {/* Create Post */}
          {isMember && (
            <div className="bg-white/5 border border-white/20 rounded-xl p-4 mb-6">
              <textarea
                placeholder="Compartilhe algo com o grupo..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-none text-white placeholder-white/50 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="text-xs text-white/50">
                  Use #hashtags para categorizar seu post
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="bg-white text-black px-4 py-2 rounded-lg font-light hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar
                </button>
              </div>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-lg">Nenhum post encontrado</p>
                <p className="text-white/30 text-sm mt-2">
                  {searchTerm || filterType !== 'all' 
                    ? 'Tente ajustar os filtros de busca'
                    : 'Seja o primeiro a iniciar uma discussão!'
                  }
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md"
                >
                  <div className="flex items-start space-x-3">
                    {/* Author Avatar */}
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      {post.author.avatar ? (
                        <img src={post.author.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        <span className="text-white/70">{post.author.name.charAt(0)}</span>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-white">{post.author.name}</span>
                        <span className="text-white/50 text-sm">
                          {post.timestamp.toLocaleDateString('pt-BR')} às {post.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <p className="text-white/90 mb-3 leading-relaxed">{post.content}</p>
                      
                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="bg-white/10 px-2 py-1 rounded-full text-xs text-white/60"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-4 text-sm">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1 transition-colors ${
                            post.liked ? 'text-red-400' : 'text-white/60 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                          <span>{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 text-white/60 hover:text-white transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentCount || 0}</span>
                        </button>
                        
                        <button className="text-white/60 hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-light mb-4">Entrar no Grupo</h3>
            <p className="text-white/70 mb-6">
              Você está prestes a entrar no grupo "{group.name}". Ao entrar, você concorda em seguir as regras do grupo e manter um ambiente respeitoso.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleJoinGroup}
                className="bg-white text-black px-4 py-2 rounded-xl font-light hover:bg-white/90 transition-all duration-300 flex-1"
              >
                Entrar no Grupo
              </button>
              <button
                onClick={() => setShowJoinModal(false)}
                className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-xl font-light hover:bg-white/10 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light">Configurações do Grupo</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-light mb-3">Informações Básicas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Nome do Grupo</label>
                    <input
                      type="text"
                      defaultValue={group.name}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Categoria</label>
                    <input
                      type="text"
                      defaultValue={group.category}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-light mb-3">Descrição</h4>
                <textarea
                  defaultValue={group.description}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                />
              </div>

              <div>
                <h4 className="text-lg font-light mb-3">Regras</h4>
                <div className="space-y-2">
                  {group.rules.map((rule, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        defaultValue={rule}
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                      />
                      <button className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button className="text-white/70 hover:text-white text-sm">
                    + Adicionar regra
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="bg-white text-black px-4 py-2 rounded-xl font-light hover:bg-white/90 transition-all duration-300 flex-1">
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-xl font-light hover:bg-white/10 transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGroup;
