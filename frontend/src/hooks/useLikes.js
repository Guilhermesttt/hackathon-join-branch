import { useState, useCallback, useEffect } from 'react';
import { postService } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export const useLikes = () => {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Sincronizar posts curtidos quando o usuário mudar
  useEffect(() => {
    if (user) {
      // Resetar posts curtidos quando o usuário mudar
      setLikedPosts(new Set());
    } else {
      // Limpar posts curtidos quando não há usuário
      setLikedPosts(new Set());
    }
  }, [user]);

  // Curtir/descurtir post
  const toggleLike = useCallback(async (postId) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const result = await postService.togglePostLike(postId, user.uid);
      
      if (result.success) {
        // Atualizar estado local
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (result.isLiked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
        
        return result.isLiked;
      }
      
      return false;
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      throw error;
    }
  }, [user]);

  // Verificar se post foi curtido
  const isLiked = useCallback((postId) => {
    return likedPosts.has(postId);
  }, [likedPosts]);

  // Obter número de posts curtidos
  const getLikedCount = useCallback(() => {
    return likedPosts.size;
  }, [likedPosts]);

  // Limpar posts curtidos (útil para logout)
  const clearLikes = useCallback(() => {
    setLikedPosts(new Set());
  }, []);

  // Sincronizar posts curtidos com dados externos
  const syncLikedPosts = useCallback((posts) => {
    if (!user) return;
    
    const likedSet = new Set();
    posts.forEach(post => {
      if (post.likes && Array.isArray(post.likes) && post.likes.includes(user.uid)) {
        likedSet.add(post.id);
      }
    });
    setLikedPosts(likedSet);
  }, [user]);

  return {
    toggleLike,
    isLiked,
    getLikedCount,
    clearLikes,
    syncLikedPosts,
    likedPosts: Array.from(likedPosts)
  };
};
