import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, User, Clock, Hash, Edit3, Trash2, Flag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import { firestoreUtils } from '../../services/firestoreService';

const PostCard = ({ post, onEdit, onDelete, onComment }) => {
  const { user } = useAuth();
  const { togglePostLike, isPostLiked } = usePosts();
  const [showActions, setShowActions] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user || isLiking) return;
    
    setIsLiking(true);
    try {
      await togglePostLike(post.id, user.uid);
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleEdit = () => {
    setShowActions(false);
    onEdit?.(post);
  };

  const handleDelete = () => {
    setShowActions(false);
    if (window.confirm('Tem certeza que deseja deletar este post?')) {
      onDelete?.(post.id);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post de ${post.author}`,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copiado para a área de transferência!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = firestoreUtils.convertTimestamp(timestamp);
    return firestoreUtils.formatRelativeTime(date);
  };

  const canModifyPost = user && (post.userId === user.uid || user.role === 'admin');
  const isLiked = isPostLiked(post.id, user?.uid);
  const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;

  return (
    <article className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
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
        {canModifyPost && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2 rounded-t-lg"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/20 flex items-center space-x-2 rounded-b-lg"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Deletar</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white/90 text-lg leading-relaxed mb-3 whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Post Image */}
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3">
            <img 
              src={post.imageUrl} 
              alt="Post image" 
              className="w-full max-h-96 object-cover"
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
                className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
              >
                <Hash className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm text-white/60 mb-4">
        <div className="flex items-center space-x-4">
          <span>{likeCount} curtida{likeCount !== 1 ? 's' : ''}</span>
          <span>{post.commentCount || 0} comentário{post.commentCount !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-6">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={!user || isLiking}
            loading={isLiking}
            className={cn(
              'transition-colors',
              isLiked 
                ? 'text-red-400 hover:text-red-300' 
                : 'text-white/70 hover:text-white'
            )}
          >
            <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
            <span className="ml-2">
              {isLiked ? 'Curtido' : 'Curtir'}
            </span>
            {likeCount > 0 && (
              <span className="ml-1 text-sm">({likeCount})</span>
            )}
          </Button>

          {/* Comment Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onComment?.(post)}
            disabled={!user}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="ml-2">Comentar</span>
            {post.commentCount > 0 && (
              <span className="ml-1 text-sm">({post.commentCount})</span>
            )}
          </Button>

          {/* Share Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5" />
            <span className="ml-2">Compartilhar</span>
          </Button>
        </div>

        {/* Report Button */}
        {user && post.userId !== user.uid && (
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-orange-400"
          >
            <Flag className="w-4 h-4" />
          </Button>
        )}
      </div>
    </article>
  );
};

export default PostCard;