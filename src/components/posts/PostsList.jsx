import React, { useState, useEffect } from 'react';
import { Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../hooks/useFirestore';
import PostCard from './PostCard';
import PostCreationModal from './PostCreationModal';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import EmptyState from '../ui/EmptyState';

const PostsList = () => {
  const { user } = useAuth();
  const { 
    posts, 
    loading, 
    error, 
    hasMore, 
    loadMorePosts, 
    deletePost,
    subscribeToRealTimeUpdates 
  } = usePosts();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showComments, setShowComments] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToRealTimeUpdates();
    return () => unsubscribe?.();
  }, [subscribeToRealTimeUpdates]);

  const handleCreatePost = () => {
    if (!user) {
      alert('Você precisa estar logado para criar um post.');
      return;
    }
    setShowCreateModal(true);
  };

  const handlePostCreated = (postData) => {
    setShowCreateModal(false);
    // Post will be automatically added to the list via the createPost hook
  };

  const handleEditPost = (post) => {
    // TODO: Implement edit functionality
    console.log('Edit post:', post.id);
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erro ao deletar post. Tente novamente.');
    }
  };

  const handleCommentPost = (post) => {
    setSelectedPost(post);
    setShowComments(true);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-white/70">Carregando posts...</span>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="text-center py-20">
        <EmptyState
          icon={MessageCircle}
          title="Erro ao carregar posts"
          description={error}
          action={
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <Button
          onClick={handleCreatePost}
          className="w-full"
          leftIcon={Plus}
        >
          Compartilhe algo...
        </Button>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="Nenhum post ainda"
          description="Seja o primeiro a compartilhar algo!"
          action={
            <Button onClick={handleCreatePost} leftIcon={Plus}>
              Criar primeiro post
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onComment={handleCommentPost}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button
                onClick={loadMorePosts}
                disabled={loading}
                loading={loading}
                variant="secondary"
              >
                {loading ? 'Carregando...' : 'Carregar mais posts'}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      <PostCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Comments Modal - TODO: Implement */}
      {showComments && selectedPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium text-white">Comentários</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* TODO: Add CommentsThread component here */}
            <p className="text-white/70">Comentários serão implementados aqui</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;