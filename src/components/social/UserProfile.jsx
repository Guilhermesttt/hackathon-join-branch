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
  Hash
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

  // Mock user posts
  const mockPosts = [
    {
      id: 'post1',
      content: 'Hoje foi um dia incrível de autoconhecimento! Consegui aplicar as técnicas de mindfulness que aprendi e me senti muito mais centrada. É incrível como pequenas mudanças podem fazer uma grande diferença no nosso bem-estar mental. 🧘‍♀️✨',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      likes: ['user2', 'user3'],
      commentCount: 5,
      tags: ['mindfulness', 'bem-estar', 'autoconhecimento'],
      imageUrl: null
    },
    {
      id: 'post2',
      content: 'Compartilhando uma reflexão: às vezes precisamos parar e reconhecer o quanto já evoluímos. Olhar para trás e ver o caminho percorrido pode ser muito motivador para continuar crescendo.',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      likes: ['user1', 'user3', 'user4'],
      commentCount: 3,
      tags: ['reflexão', 'crescimento'],
      imageUrl: null
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
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    if (diffInHours < 48) return 'Ontem';
    
    return d.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short' 
    });
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
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
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
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Profile Info */}
        <div className="p-6 -mt-16 relative">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
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
                className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {profile.displayName || 'Usuário'}
              </h1>
              
              <p className="text-white/70 text-lg mb-3">
                @{profile.username || 'usuario'}
              </p>
              
              {profile.bio && (
                <p className="text-white/80 mb-4 max-w-md leading-relaxed">
                  {profile.bio}
                </p>
              )}
              
              {/* User Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                
                {profile.website && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
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
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Entrou em {formatDate(profile.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {isOwnProfile ? (
                <Button
                  onClick={() => setShowEditModal(true)}
                  variant="secondary"
                  leftIcon={Edit3}
                >
                  Editar perfil
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleFollow}
                    variant={isFollowing ? 'secondary' : 'default'}
                    leftIcon={isFollowing ? UserMinus : UserPlus}
                  >
                    {isFollowing ? 'Deixar de seguir' : 'Seguir'}
                  </Button>
                  
                  <Button
                    onClick={handleMessage}
                    variant="secondary"
                    leftIcon={MessageCircle}
                  >
                    Mensagem
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 text-sm">
            <div className="text-center">
              <div className="font-bold text-white text-lg">
                {profile.postCount || 0}
              </div>
              <div className="text-white/60">Posts</div>
            </div>
            
            <div className="text-center cursor-pointer hover:text-white transition-colors">
              <div className="font-bold text-white text-lg">
                {profile.followers?.length || 0}
              </div>
              <div className="text-white/60">Seguidores</div>
            </div>
            
            <div className="text-center cursor-pointer hover:text-white transition-colors">
              <div className="font-bold text-white text-lg">
                {profile.following?.length || 0}
              </div>
              <div className="text-white/60">Seguindo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl">
        {/* Tab Navigation */}
        <div className="flex border-b border-white/10">
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
              <span className="font-medium">{tab.label}</span>
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
                  <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                          {profile.photoURL ? (
                            <img 
                              src={profile.photoURL} 
                              alt={profile.displayName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white/70" />
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-white">
                            {profile.displayName}
                          </h4>
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
                    
                    <p className="text-white/90 leading-relaxed mb-3">
                      {post.content}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                          >
                            <Hash className="w-3 h-3" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes.length}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount}</span>
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
    </div>
  );
};

export default UserProfile;