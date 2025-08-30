import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Edit3, 
  UserPlus, 
  UserMinus, 
  MessageCircle,
  MoreVertical,
  Settings,
  Share2,
  Flag,
  Camera,
  Heart,
  Hash,
  Eye,
  Users,
  Star,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const UserProfile = ({ userId, isOwnProfile = false }) => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  // Mock user posts
  const mockPosts = [
    {
      id: 'post1',
      content: 'Hoje foi um dia incrível de autoconhecimento! Consegui aplicar as técnicas de mindfulness que aprendi e me senti muito mais centrada. É incrível como pequenas mudanças podem fazer uma grande diferença no nosso bem-estar mental. 🧘‍♀️✨',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: ['user2', 'user3', 'user4', 'user5'],
      commentCount: 8,
      shares: 2,
      tags: ['mindfulness', 'bem-estar', 'autoconhecimento'],
      imageUrl: null,
      mood: 'happy'
    },
    {
      id: 'post2',
      content: 'Compartilhando uma reflexão: às vezes precisamos parar e reconhecer o quanto já evoluímos. Olhar para trás e ver o caminho percorrido pode ser muito motivador para continuar crescendo. 💪',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      likes: ['user1', 'user3', 'user4'],
      commentCount: 5,
      shares: 1,
      tags: ['reflexão', 'crescimento', 'motivação'],
      imageUrl: null,
      mood: 'thoughtful'
    },
    {
      id: 'post3',
      content: 'Dica para quem está lidando com ansiedade: a técnica de respiração 4-7-8 tem me ajudado muito. Inspire por 4 segundos, segure por 7, expire por 8. Simples mas eficaz! 🌬️',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
      likes: ['user2', 'user5', 'user6'],
      commentCount: 12,
      shares: 6,
      tags: ['ansiedade', 'respiração', 'dica'],
      imageUrl: null,
      mood: 'calm'
    }
  ];

  useEffect(() => {
    if (profile) {
      // Check if current user is following this profile
      setIsFollowing(profile.followers?.includes(user?.uid) || false);
      
      // Load user posts
      setPostsLoading(true);
      setTimeout(() => {
        setUserPosts(mockPosts);
        setPostsLoading(false);
      }, 500);
    }
  }, [profile, user?.uid]);

  const handleFollow = async () => {
    if (!user || isOwnProfile) return;
    
    try {
      // TODO: Implement follow/unfollow logic
      setIsFollowing(!isFollowing);
      console.log(isFollowing ? 'Unfollowing' : 'Following', userId);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleMessage = () => {
    // TODO: Open direct message
    console.log('Opening message with', userId);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const formatPostDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diffInHours = (now - d) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'agora';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    if (diffInHours < 48) return 'ontem';
    
    return d.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      calm: '😌',
      sad: '😔',
      anxious: '😰',
      angry: '😡',
      thoughtful: '🤔'
    };
    return moodMap[mood] || '😐';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/70">Carregando perfil...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <EmptyState
        icon={User}
        title="Perfil não encontrado"
        description="Este usuário não existe ou foi removido"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-black border border-white/20 rounded-2xl overflow-hidden">
        {/* Banner */}
        <div className="relative h-48 bg-gradient-to-r from-white/10 to-white/5">
          {profile.bannerURL && (
            <img 
              src={profile.bannerURL} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          )}
          
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white"
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-8 -mt-16 relative">
          {/* Avatar */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-black overflow-hidden">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt={profile.displayName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full text-white/50 p-8" />
              )}
            </div>
            
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/90 rounded-full text-white"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-4xl font-bold text-white">
                  {profile.displayName || 'Usuário'}
                </h1>
                
                {profile.isVerified && (
                  <Check className="w-6 h-6 text-white bg-white/20 rounded-full p-1" />
                )}
                
                {profile.isPremium && (
                  <Star className="w-6 h-6 text-yellow-400" />
                )}
              </div>
              
              <p className="text-white/70 text-xl mb-4">
                @{profile.username || 'usuario'}
              </p>
              
              {profile.bio && (
                <p className="text-white/80 mb-6 max-w-2xl leading-relaxed text-lg">
                  {profile.bio}
                </p>
              )}
              
              {/* User Details */}
              <div className="flex flex-wrap items-center gap-6 text-base text-white/60 mb-6">
                {profile.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5" />
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white hover:text-white/80 transition-colors"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                
                {profile.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Entrou em {formatDate(profile.createdAt)}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 text-lg">
                <div className="text-center cursor-pointer hover:text-white transition-colors">
                  <div className="font-bold text-white text-2xl">
                    {profile.postCount || userPosts.length}
                  </div>
                  <div className="text-white/60">Posts</div>
                </div>
                
                <div 
                  className="text-center cursor-pointer hover:text-white transition-colors"
                  onClick={() => setShowFollowersModal(true)}
                >
                  <div className="font-bold text-white text-2xl">
                    {profile.followers?.length || 1247}
                  </div>
                  <div className="text-white/60">Seguidores</div>
                </div>
                
                <div 
                  className="text-center cursor-pointer hover:text-white transition-colors"
                  onClick={() => setShowFollowingModal(true)}
                >
                  <div className="font-bold text-white text-2xl">
                    {profile.following?.length || 892}
                  </div>
                  <div className="text-white/60">Seguindo</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isOwnProfile ? (
                <Button
                  onClick={() => setShowEditModal(true)}
                  variant="secondary"
                  leftIcon={Edit3}
                  size="lg"
                >
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? 'secondary' : 'default'}
                    leftIcon={isFollowing ? UserMinus : UserPlus}
                    size="lg"
                    className="px-8"
                  >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                  </Button>
                  
                  <Button
                    onClick={handleMessage}
                    variant="secondary"
                    leftIcon={MessageCircle}
                    size="lg"
                  >
                    Mensagem
                  </Button>
                  
                  <Button variant="ghost" size="lg">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-black border border-white/20 rounded-2xl">
        {/* Tab Navigation */}
        <div className="flex border-b border-white/20">
          {[
            { id: 'posts', label: 'Posts', count: userPosts.length },
            { id: 'media', label: 'Mídia', count: 0 },
            { id: 'likes', label: 'Curtidas', count: 0 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-center transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-white bg-white/5'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="font-bold text-lg">{tab.label}</span>
              {tab.count > 0 && (
                <span className="ml-2 text-sm text-white/50">({tab.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {postsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                  <span className="ml-3 text-white/70">Carregando posts...</span>
                </div>
              ) : userPosts.length === 0 ? (
                <EmptyState
                  icon={MessageCircle}
                  title="Nenhum post ainda"
                  description={isOwnProfile ? "Você ainda não fez nenhum post" : "Este usuário ainda não fez nenhum post"}
                  variant="muted"
                />
              ) : (
                userPosts.map((post) => (
                  <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                          {profile.photoURL ? (
                            <img 
                              src={profile.photoURL} 
                              alt={profile.displayName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white/70" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-white">
                              {profile.displayName}
                            </h4>
                            {post.mood && (
                              <span className="text-lg">{getMoodEmoji(post.mood)}</span>
                            )}
                          </div>
                          <p className="text-sm text-white/50">
                            {formatPostDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      {isOwnProfile && (
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-white text-lg leading-relaxed mb-4">
                      {post.content}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-white/20"
                          >
                            <Hash className="w-3 h-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-white/60">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-5 h-5" />
                          <span className="font-medium">{post.likes.length}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-medium">{post.commentCount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Share2 className="w-5 h-5" />
                          <span className="font-medium">{post.shares}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-red-400">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <EmptyState
              icon={Camera}
              title="Nenhuma mídia"
              description="Posts com imagens aparecerão aqui"
              variant="muted"
            />
          )}

          {activeTab === 'likes' && (
            <EmptyState
              icon={Heart}
              title="Nenhuma curtida"
              description="Posts curtidos aparecerão aqui"
              variant="muted"
            />
          )}
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Seguidores</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFollowersModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Mock followers */}
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Usuário {i + 1}</h4>
                    <p className="text-sm text-white/60">@usuario{i + 1}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Seguindo</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFollowingModal(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {/* Mock following */}
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">Usuário {i + 1}</h4>
                    <p className="text-sm text-white/60">@usuario{i + 1}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;