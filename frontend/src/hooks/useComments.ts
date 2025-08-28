import { useState, useEffect, useCallback } from 'react';
import { commentService, firebaseUtils } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: string[];
  createdAt: any;
  updatedAt?: any;
  isEdited?: boolean;
  isHidden?: boolean;
  isReported?: boolean;
  reportedBy?: string[];
  reportReasons?: string[];
}

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  // Carregar comentários do post
  const loadComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);
      
      const fetchedComments = await commentService.getPostComments(postId, 50);
      
      // Converter timestamps e formatar dados
      const formattedComments = fetchedComments.map(comment => ({
        ...comment,
        createdAt: firebaseUtils.convertTimestamp(comment.createdAt),
        updatedAt: comment.updatedAt ? firebaseUtils.convertTimestamp(comment.updatedAt) : undefined
      }));
      
      setComments(formattedComments);
      setHasMore(fetchedComments.length === 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar comentários');
      console.error('Erro ao carregar comentários:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Adicionar novo comentário
  const addComment = useCallback(async (content: string, isAnonymous: boolean = false) => {
    if (!user || !postId) {
      throw new Error('Usuário não autenticado ou post não especificado');
    }

    try {
      const commentData = {
        authorId: user.uid,
        authorName: isAnonymous ? 'Usuário Anônimo' : (user.displayName || user.email || 'Usuário'),
        authorAvatar: isAnonymous ? null : user.photoURL,
        content: content.trim(),
        isAnonymous
      };

      const result = await commentService.addComment(postId, commentData);
      
      if (result.success) {
        // Adicionar novo comentário ao estado local
        const newComment: Comment = {
          id: result.commentId,
          postId,
          ...commentData,
          likes: [],
          createdAt: new Date(),
          isHidden: false,
          isReported: false
        };
        
        setComments(prev => [newComment, ...prev]);
        return result.commentId;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      throw err;
    }
  }, [user, postId]);

  // Editar comentário
  const editComment = useCallback(async (commentId: string, newContent: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const success = await commentService.editComment(commentId, newContent);
      
      if (success) {
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return { 
                ...comment, 
                content: newContent, 
                isEdited: true,
                updatedAt: new Date()
              };
            }
            return comment;
          })
        );
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
      throw err;
    }
  }, [user]);

  // Deletar comentário
  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const success = await commentService.deleteComment(commentId);
      
      if (success) {
        setComments(prevComments => 
          prevComments.filter(comment => comment.id !== commentId)
        );
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao deletar comentário:', err);
      throw err;
    }
  }, [user]);

  // Ocultar/Mostrar comentário
  const hideComment = useCallback(async (commentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const success = await commentService.toggleCommentVisibility(commentId);
      
      if (success) {
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, isHidden: !comment.isHidden };
            }
            return comment;
          })
        );
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao ocultar comentário:', err);
      throw err;
    }
  }, [user]);

  // Reportar comentário
  const reportComment = useCallback(async (commentId: string, reason: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const success = await commentService.reportComment(commentId, reason);
      
      if (success) {
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              return { 
                ...comment, 
                isReported: true,
                reportedBy: [...(comment.reportedBy || []), user.uid],
                reportReasons: [...(comment.reportReasons || []), reason]
              };
            }
            return comment;
          })
        );
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao reportar comentário:', err);
      throw err;
    }
  }, [user]);

  // Curtir/descurtir comentário
  const toggleCommentLike = useCallback(async (commentId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const success = await commentService.toggleCommentLike(commentId, user.uid);
      
      if (success) {
        setComments(prevComments => 
          prevComments.map(comment => {
            if (comment.id === commentId) {
              const isLiked = comment.likes.includes(user.uid);
              if (isLiked) {
                return { ...comment, likes: comment.likes.filter(id => id !== user.uid) };
              } else {
                return { ...comment, likes: [...comment.likes, user.uid] };
              }
            }
            return comment;
          })
        );
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao curtir comentário:', err);
      throw err;
    }
  }, [user]);

  // Verificar se comentário foi curtido pelo usuário
  const isCommentLiked = useCallback((commentId: string) => {
    if (!user) return false;
    const comment = comments.find(c => c.id === commentId);
    return comment ? comment.likes.includes(user.uid) : false;
  }, [user, comments]);

  // Carregar comentários na inicialização
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    hasMore,
    loadMoreComments: loadComments,
    addComment,
    editComment,
    deleteComment,
    hideComment,
    reportComment,
    toggleCommentLike,
    isCommentLiked,
    refreshComments: loadComments
  };
};
