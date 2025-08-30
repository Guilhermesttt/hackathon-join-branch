import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, User, Clock, Hash, Bookmark, Send, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const SocialFeed = () => {
  const { user } = useAuth();
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
  
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComment, setNewComment] = useState({});

  const handleLikePost = useCallback(async (postId) => {
    if (!user) return;
    try {
      await togglePostLike(postId, user.uid);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  }, [user, togglePostLike]);

  const handleDeletePost = useCallback(async (postId) => {
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      try {
        await deletePost(postId);
        setShowActionsFor(null);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  }, [deletePost]);

  const handleSharePost = useCallback(async (post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post de ${post.author}`,
          text: post.content.substring(0, 100) + '...',
          url: `${window.location.origin}/post/${post.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  }, []);

  const toggleComments = useCallback((postId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const handleAddComment = useCallback((postId) => {
    const comment = newComment[postId];
    if (!comment?.trim()) return;
    
    // TODO: Implement comment addition
    console.log('Adding comment:', comment, 'to post:', postId);
    
    setNewComment(prev => ({ ...prev, [postId]: '' }));
  }, [newComment]);

  const formatTimestamp = useCallback((timestamp) => {
    if (!timestamp) return 'Agora mesmo';
    
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }, []);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/70">Carregando feed...</span>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Erro ao carregar feed"
        description={error}
        action={
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        }
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Nenhum post ainda"
        description="Seja o primeiro a compartilhar algo na comunidade!"
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <article 
          key={post.id} 
          className="bg-black border border-white/20 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300 group"
        >
          {/* Post Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden">
                    {post.avatar ? (
                      <img 
                        src={post.avatar} 
                        alt={post.author} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white/70" />
                    )}
                  </div>
                  {/* Online status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-black rounded-full"></div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-white hover:text-white/80 transition-colors cursor-pointer text-lg">
                      {post.isAnonymous ? 'Usuário Anônimo' : post.author}
                    </h3>
                    
                    {post.isAnonymous && (
                      <span className="px-2 py-1 bg-white/20 text-white/80 text-xs rounded-full border border-white/30 font-medium">
                        Anônimo
                      </span>
                    )}
                    
                    {post.visibility === 'private' && (
                      <EyeOff className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-white/50">
                    <span>@{post.isAnonymous ? 'anonimo' : (post.username || 'usuario')}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(post.createdAt)}</span>
                    {post.isEdited && (
                      <>
                        <span>•</span>
                        <span className="text-xs text-white/30">editado</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Actions Menu */}
              {user && (post.userId === user.uid || user.role === 'admin') && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowActionsFor(showActionsFor === post.id ? null : post.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>

                  {showActionsFor === post.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-white/20 rounded-xl shadow-2xl z-10 py-2">
                      <button
                        onClick={() => {
                          // TODO: Implement edit
                          setShowActionsFor(null);
                        }}
                        className="w-full px-4 py-2 text-left text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center space-x-2"
                      >
                        <Hash className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                      >
                        <MoreVertical className="w-4 h-4" />
                        <span>Deletar</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-white text-lg leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
              </p>
              
              {/* Post Image */}
              {post.imageUrl && (
                <div className="rounded-xl overflow-hidden mb-4 border border-white/10">
                  <img 
                    src={post.imageUrl} 
                    alt="Post image" 
                    className="w-full max-h-96 object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-white/10 text-white/80 text-sm rounded-full border border-white/20 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                    >
                      <Hash className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Post Stats */}
          <div className="px-6 pb-2">
            <div className="flex items-center justify-between text-sm text-white/50">
              <div className="flex items-center space-x-4">
                <span className="hover:text-white transition-colors cursor-pointer">
                  {Array.isArray(post.likes) ? post.likes.length : 0} curtidas
                </span>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {post.commentCount || 0} comentários
                </span>
                <span className="hover:text-white transition-colors cursor-pointer">
                  {post.shares || 0} compartilhamentos
                </span>
              </div>
            </div>
          </div>

          {/* Post Actions */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {/* Like Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikePost(post.id)}
                  disabled={!user}
                  className={`transition-all duration-200 px-4 py-2 ${
                    isPostLiked(post.id, user?.uid)
                      ? 'text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isPostLiked(post.id, user?.uid) ? 'fill-current' : ''}`} />
                  <span className="ml-2 font-medium">
                    Curtir
                  </span>
                </Button>

                {/* Comment Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  disabled={!user}
                  className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="ml-2 font-medium">Comentar</span>
                </Button>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSharePost(post)}
                  className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="ml-2 font-medium">Compartilhar</span>
                </Button>
              </div>

              {/* Bookmark Button */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          {expandedComments.has(post.id) && (
            <div className="px-6 pb-6 border-t border-white/10 bg-white/5">
              <div className="pt-4 space-y-4">
                {/* Add Comment */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
                    ) : (
                      <User className="w-4 h-4 text-white/70" />
                    )}
                  </div>
                  
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment[post.id] || ''}
                      onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                      placeholder="Adicione um comentário..."
                      className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment[post.id]?.trim()}
                      className="px-3"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-3 ml-11">
                  {/* Mock comments for now */}
                  <div className="text-center text-white/50 py-4">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum comentário ainda</p>
                    <p className="text-xs text-white/30 mt-1">Seja o primeiro a comentar!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </article>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-6">
          <Button
            onClick={loadMorePosts}
            disabled={loading}
            loading={loading}
            variant="secondary"
            size="lg"
            className="px-8"
          >
            {loading ? 'Carregando...' : 'Carregar mais posts'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;