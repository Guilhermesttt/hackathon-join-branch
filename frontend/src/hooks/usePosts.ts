import { useState, useEffect, useCallback } from 'react';
import { postService, commentService, firebaseUtils } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

export interface Post {
  id: string;
  content: string;
  author: string;
  userId: string;
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: string[];
  commentCount: number;
  shares: number;
  tags: string[];
  isAnonymous: boolean;
  visibility: 'public' | 'private' | 'anonymous';
  isEdited?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: string[];
  createdAt: any;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  // Carregar posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedPosts = await postService.getPosts(20);
      
      // Converter timestamps e formatar dados
      const formattedPosts = fetchedPosts.map(post => ({
        ...post,
        createdAt: firebaseUtils.convertTimestamp(post.createdAt),
        updatedAt: post.updatedAt ? firebaseUtils.convertTimestamp(post.updatedAt) : undefined
      }));
      
      setPosts(formattedPosts);
      setHasMore(fetchedPosts.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
      console.error('Erro ao carregar posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar mais posts
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      
      const fetchedPosts = await postService.getPosts(20, posts.length);
      
      if (fetchedPosts.length === 0) {
        setHasMore(false);
        return;
      }
      
      // Converter timestamps e formatar dados
      const formattedPosts = fetchedPosts.map(post => ({
        ...post,
        createdAt: firebaseUtils.convertTimestamp(post.createdAt),
        updatedAt: post.updatedAt ? firebaseUtils.convertTimestamp(post.updatedAt) : undefined
      }));
      
      setPosts(prev => [...prev, ...formattedPosts]);
      setHasMore(fetchedPosts.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais posts');
      console.error('Erro ao carregar mais posts:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, posts.length]);

  // Criar novo post
  const createPost = useCallback(async (postData: {
    content: string;
    tags: string[];
    isAnonymous: boolean;
    visibility: 'public' | 'private' | 'anonymous';
    userId: string;
    author: string;
    avatar?: string;
  }) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const result = await postService.createPost(postData);
      
      if (result.success) {
        // Adicionar novo post ao estado local
        const newPost: Post = {
          id: result.postId,
          ...postData,
          createdAt: new Date(),
          likes: [],
          commentCount: 0,
          shares: 0,
          isEdited: false
        };
        
        setPosts(prev => [newPost, ...prev]);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao criar post:', err);
      throw err;
    }
  }, [user]);

  // Deletar post
  const deletePost = useCallback(async (postId: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const success = await postService.deletePost(postId);
      
      if (success) {
        // Remover post do estado local
        setPosts(prev => prev.filter(post => post.id !== postId));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Erro ao deletar post:', err);
      throw err;
    }
  }, [user]);

  // Curtir/descurtir post
  const togglePostLike = useCallback(async (postId: string) => {
    if (!user) return false;
    
    try {
      const success = await postService.togglePostLike(postId, user.uid);
      
      if (success) {
        // Atualizar estado local
        setPosts(prev => 
          prev.map(post => {
            if (post.id === postId) {
              const isLiked = post.likes.includes(user.uid);
              const newLikes = isLiked 
                ? post.likes.filter(id => id !== user.uid)
                : [...post.likes, user.uid];
              
              return {
                ...post,
                likes: newLikes
              };
            }
            return post;
          })
        );
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao curtir post:', error);
      return false;
    }
  }, [user]);

  // Verificar se post foi curtido pelo usuário atual
  const isPostLiked = useCallback((postId: string) => {
    if (!user) return false;
    
    const post = posts.find(p => p.id === postId);
    return post ? post.likes.includes(user.uid) : false;
  }, [posts, user]);

  // Adicionar comentário
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const commentData = {
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Usuário',
        authorAvatar: user.photoURL,
        content: content.trim()
      };

      const result = await commentService.addComment(postId, commentData);
      
      if (result.success) {
        // Atualizar contador de comentários no estado local
        setPosts(prevPosts => 
          prevPosts.map(post => {
            if (post.id === postId) {
              return { ...post, commentCount: post.commentCount + 1 };
            }
            return post;
          })
        );
        
        return result.commentId;
      }
      
      return null;
    } catch (err) {
      console.error('Erro ao adicionar comentário:', err);
      throw err;
    }
  }, [user]);

  // Buscar comentários de um post
  const getPostComments = useCallback(async (postId: string) => {
    try {
      const comments = await commentService.getPostComments(postId);
      
      // Converter timestamps
      return comments.map(comment => ({
        ...comment,
        createdAt: firebaseUtils.convertTimestamp(comment.createdAt)
      }));
    } catch (err) {
      console.error('Erro ao buscar comentários:', err);
      throw err;
    }
  }, []);

  // Carregar posts na inicialização
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadMorePosts,
    createPost,
    deletePost,
    togglePostLike,
    isPostLiked,
    addComment,
    getPostComments,
    refreshPosts: loadPosts
  };
};
