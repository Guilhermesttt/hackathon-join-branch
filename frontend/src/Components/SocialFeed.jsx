import React, { useState, useEffect } from 'react';
import { Heart, MoreVertical, User, Clock, Edit3, Trash2, Flag, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { useAuth } from '../contexts/AuthContext';
import CommentsThread from './CommentsThread';

const SocialFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());

  const {
    posts,
    loading,
    error,
    hasMore,
    loadMorePosts,
    togglePostLike,
    isPostLiked,
    deletePost
  } = usePosts();

  const handleLikePost = async (postId) => {
    if (!user) return;
    await togglePostLike(postId);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      setDeletingPostId(postId);
      try {
        const success = await deletePost(postId);
        if (success) {
          setShowActionsFor(null);
        }
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      } finally {
        setDeletingPostId(null);
      }
    }
  };

  const handleEditPost = (postId) => {
    // TODO: Implement edit functionality
    console.log('Edit post:', postId);
    setShowActionsFor(null);
  };

  const handleSharePost = async () => {};

  const toggleComments = () => {};

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Agora mesmo';
    
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-white/70">Carregando posts...</span>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Flag className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl text-white/60 mb-2">Erro ao carregar posts</h3>
        <p className="text-white/40 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-12 h-12 text-white/30" />
        </div>
        <h3 className="text-xl text-white/60 mb-2">Nenhum post ainda</h3>
        <p className="text-white/40">
          Seja o primeiro a compartilhar algo!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Posts */}
      {posts.map((post) => (
        <article key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {post.isAnonymous ? '?' : (post.author?.charAt(0) || 'U')}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-white font-semibold">
                    {post.isAnonymous ? 'Usuário Anônimo' : post.author}
                  </h3>
                  {post.isAnonymous && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      Anônimo
                    </span>
                  )}
                  {post.visibility === 'private' && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      Privado
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(post.createdAt)}</span>
                  {post.isEdited && (
                    <span className="text-xs text-white/40">(editado)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Post Actions Menu */}
            {user && (post.userId === user.uid || user.role === 'admin') && (
              <div className="relative">
                <button
                  onClick={() => setShowActionsFor(showActionsFor === post.id ? null : post.id)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-white/60" />
                </button>

                {showActionsFor === post.id && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-10">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2 rounded-t-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletingPostId === post.id}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 flex items-center space-x-2 rounded-b-lg disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>
                        {deletingPostId === post.id ? 'Deletando...' : 'Deletar'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-white/90 text-lg leading-relaxed mb-3">
              {post.content}
            </p>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Post Stats (simplificado) */}
          <div className="flex items-center justify-between text-sm text-white/60 mb-4">
            <div className="flex items-center space-x-4">
              <span>{post.likes?.length || 0} curtidas</span>
            </div>
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              <button
                onClick={() => handleLikePost(post.id)}
                disabled={!user}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isPostLiked(post.id)
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Heart className={`w-5 h-5 ${isPostLiked(post.id) ? 'fill-current' : ''}`} />
                <span className="font-medium">
                  {isPostLiked(post.id) ? 'Curtido' : 'Curtir'}
                </span>
                {post.likes?.length > 0 && (
                  <span className="text-sm">({post.likes.length})</span>
                )}
              </button>

              {/* Comentários e compartilhamento removidos */}
            </div>
          </div>

          {/* Seção de comentários removida */}
        </article>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMorePosts}
            disabled={loading}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Carregar mais posts'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;