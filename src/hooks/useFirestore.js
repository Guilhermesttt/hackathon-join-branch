import { useState, useEffect, useCallback } from 'react';
import { 
  postsService, 
  commentsService, 
  usersService, 
  communitiesService, 
  moodService, 
  notificationsService 
} from '../services/firestoreService';

// Enhanced posts hook with real Firebase integration
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);

  // Load initial posts
  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await postsService.getPosts(20);
      setPosts(result.posts);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      
      const result = await postsService.getPosts(20, lastDoc);
      setPosts(prev => [...prev, ...result.posts]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
      console.error('Error loading more posts:', err);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, lastDoc]);

  // Create post
  const createPost = useCallback(async (postData) => {
    try {
      const result = await postsService.createPost(postData);
      
      if (result.success) {
        // Add new post to the beginning of the list
        const newPost = {
          id: result.postId,
          ...postData,
          createdAt: new Date(),
          likes: [],
          commentCount: 0,
          shares: 0
        };
        setPosts(prev => [newPost, ...prev]);
        return result.postId;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete post
  const deletePost = useCallback(async (postId) => {
    try {
      const result = await postsService.deletePost(postId);
      
      if (result.success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Toggle post like
  const togglePostLike = useCallback(async (postId, userId) => {
    try {
      const result = await postsService.togglePostLike(postId, userId);
      
      if (result.success) {
        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            const likes = post.likes || [];
            const isLiked = likes.includes(userId);
            
            return {
              ...post,
              likes: isLiked 
                ? likes.filter(id => id !== userId)
                : [...likes, userId]
            };
          }
          return post;
        }));
        
        return result.isLiked;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Check if post is liked by user
  const isPostLiked = useCallback((postId, userId) => {
    const post = posts.find(p => p.id === postId);
    return post ? (post.likes || []).includes(userId) : false;
  }, [posts]);

  // Subscribe to real-time updates
  const subscribeToRealTimeUpdates = useCallback(() => {
    return postsService.subscribeToRealTimeUpdates((updatedPosts) => {
      setPosts(updatedPosts);
    });
  }, []);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    hasMore,
    loadPosts,
    loadMorePosts,
    createPost,
    deletePost,
    togglePostLike,
    isPostLiked,
    subscribeToRealTimeUpdates
  };
};

// Enhanced comments hook
export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load comments
  const loadComments = useCallback(async () => {
    if (!postId) return;

    try {
      setLoading(true);
      setError(null);
      
      const fetchedComments = await commentsService.getPostComments(postId);
      setComments(fetchedComments);
    } catch (err) {
      setError(err.message);
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Add comment
  const addComment = useCallback(async (content, isAnonymous = false, userId, userName, userAvatar) => {
    try {
      const commentData = {
        authorId: userId,
        authorName: isAnonymous ? 'Usuário Anônimo' : userName,
        authorAvatar: isAnonymous ? null : userAvatar,
        content: content.trim(),
        isAnonymous
      };

      const result = await commentsService.addComment(postId, commentData);
      
      if (result.success) {
        const newComment = {
          id: result.commentId,
          postId,
          ...commentData,
          createdAt: new Date(),
          likes: []
        };
        
        setComments(prev => [...prev, newComment]);
        return result.commentId;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [postId]);

  // Delete comment
  const deleteComment = useCallback(async (commentId) => {
    try {
      const result = await commentsService.deleteComment(commentId);
      
      if (result.success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Toggle comment like
  const toggleCommentLike = useCallback(async (commentId, userId) => {
    try {
      const result = await commentsService.toggleCommentLike(commentId, userId);
      
      if (result.success) {
        setComments(prev => prev.map(comment => {
          if (comment.id === commentId) {
            const likes = comment.likes || [];
            const isLiked = likes.includes(userId);
            
            return {
              ...comment,
              likes: isLiked 
                ? likes.filter(id => id !== userId)
                : [...likes, userId]
            };
          }
          return comment;
        }));
        
        return result.isLiked;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Check if comment is liked by user
  const isCommentLiked = useCallback((commentId, userId) => {
    const comment = comments.find(c => c.id === commentId);
    return comment ? (comment.likes || []).includes(userId) : false;
  }, [comments]);

  // Load comments on mount
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    loadComments,
    addComment,
    deleteComment,
    toggleCommentLike,
    isCommentLiked
  };
};

// Enhanced notifications hook
export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const fetchedNotifications = await notificationsService.getUserNotifications(userId);
      setNotifications(fetchedNotifications);
      
      const unread = fetchedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(err.message);
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Mark as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      const result = await notificationsService.markAsRead(notificationId);
      
      if (result.success) {
        setNotifications(prev => prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, readAt: new Date() }
            : notification
        ));
        
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Subscribe to real-time notifications
  const subscribeToNotifications = useCallback(() => {
    if (!userId) return () => {};

    return notificationsService.subscribeToUserNotifications(userId, (updatedNotifications) => {
      setNotifications(updatedNotifications);
      const unread = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    });
  }, [userId]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    loadNotifications,
    markAsRead,
    subscribeToNotifications
  };
};

// Enhanced communities hook
export const useCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [userCommunities, setUserCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load communities
  const loadCommunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedCommunities = await communitiesService.getCommunities();
      setCommunities(fetchedCommunities);
    } catch (err) {
      setError(err.message);
      console.error('Error loading communities:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create community
  const createCommunity = useCallback(async (communityData) => {
    try {
      const result = await communitiesService.createCommunity(communityData);
      
      if (result.success) {
        const newCommunity = {
          id: result.communityId,
          ...communityData,
          createdAt: new Date(),
          memberCount: 1,
          postCount: 0
        };
        
        setCommunities(prev => [newCommunity, ...prev]);
        setUserCommunities(prev => [...prev, newCommunity]);
        
        return result.communityId;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Join community
  const joinCommunity = useCallback(async (communityId, userId) => {
    try {
      const result = await communitiesService.joinCommunity(communityId, userId);
      
      if (result.success) {
        setCommunities(prev => prev.map(community => 
          community.id === communityId 
            ? { 
                ...community, 
                memberCount: community.memberCount + 1,
                members: [...(community.members || []), userId]
              }
            : community
        ));
        
        const joinedCommunity = communities.find(c => c.id === communityId);
        if (joinedCommunity) {
          setUserCommunities(prev => [...prev, joinedCommunity]);
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [communities]);

  // Leave community
  const leaveCommunity = useCallback(async (communityId, userId) => {
    try {
      const result = await communitiesService.leaveCommunity(communityId, userId);
      
      if (result.success) {
        setCommunities(prev => prev.map(community => 
          community.id === communityId 
            ? { 
                ...community, 
                memberCount: Math.max(0, community.memberCount - 1),
                members: (community.members || []).filter(id => id !== userId)
              }
            : community
        ));
        
        setUserCommunities(prev => prev.filter(c => c.id !== communityId));
        
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Load communities on mount
  useEffect(() => {
    loadCommunities();
  }, [loadCommunities]);

  return {
    communities,
    userCommunities,
    loading,
    error,
    loadCommunities,
    createCommunity,
    joinCommunity,
    leaveCommunity
  };
};

// Enhanced mood tracking hook
export const useMoodTracking = (userId) => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load mood history
  const loadMoodHistory = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const history = await moodService.getUserMoodHistory(userId, 30);
      setMoodHistory(history);
    } catch (err) {
      setError(err.message);
      console.error('Error loading mood history:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Record mood
  const recordMood = useCallback(async (moodData) => {
    try {
      const result = await moodService.recordMood(userId, moodData);
      
      if (result.success) {
        const newMoodEntry = {
          id: result.moodId,
          userId,
          ...moodData,
          recordedAt: new Date()
        };
        
        setMoodHistory(prev => [newMoodEntry, ...prev]);
        return result.moodId;
      }
      
      return null;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  // Get mood statistics
  const getMoodStats = useCallback(() => {
    if (moodHistory.length === 0) {
      return {
        averageIntensity: 0,
        averageEnergy: 0,
        averageStability: 0,
        totalEntries: 0,
        weeklyTrend: 'stable'
      };
    }

    const totalIntensity = moodHistory.reduce((sum, mood) => sum + (mood.intensity || 0), 0);
    const totalEnergy = moodHistory.reduce((sum, mood) => sum + (mood.energy || 0), 0);
    const totalStability = moodHistory.reduce((sum, mood) => sum + (mood.stability || 0), 0);
    
    const count = moodHistory.length;
    
    // Calculate weekly trend
    const thisWeek = moodHistory.filter(mood => {
      const moodDate = mood.recordedAt?.toDate ? mood.recordedAt.toDate() : new Date(mood.recordedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate > weekAgo;
    });
    
    const lastWeek = moodHistory.filter(mood => {
      const moodDate = mood.recordedAt?.toDate ? mood.recordedAt.toDate() : new Date(mood.recordedAt);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return moodDate > twoWeeksAgo && moodDate <= weekAgo;
    });
    
    const thisWeekAvg = thisWeek.length > 0 
      ? thisWeek.reduce((sum, mood) => sum + (mood.intensity || 0), 0) / thisWeek.length 
      : 0;
    const lastWeekAvg = lastWeek.length > 0 
      ? lastWeek.reduce((sum, mood) => sum + (mood.intensity || 0), 0) / lastWeek.length 
      : 0;
    
    let weeklyTrend = 'stable';
    if (thisWeekAvg > lastWeekAvg + 0.5) weeklyTrend = 'improving';
    if (thisWeekAvg < lastWeekAvg - 0.5) weeklyTrend = 'declining';

    return {
      averageIntensity: Math.round((totalIntensity / count) * 10) / 10,
      averageEnergy: Math.round((totalEnergy / count) * 10) / 10,
      averageStability: Math.round((totalStability / count) * 10) / 10,
      totalEntries: count,
      weeklyTrend
    };
  }, [moodHistory]);

  // Load mood history on mount
  useEffect(() => {
    loadMoodHistory();
  }, [loadMoodHistory]);

  return {
    moodHistory,
    loading,
    error,
    loadMoodHistory,
    recordMood,
    getMoodStats
  };
};

// Enhanced user profile hook
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const userProfile = await usersService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (err) {
      setError(err.message);
      console.error('Error loading user profile:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    try {
      const result = await usersService.updateUserProfile(userId, updates);
      
      if (result.success) {
        setProfile(prev => ({
          ...prev,
          ...updates,
          updatedAt: new Date()
        }));
        
        return true;
      }
      
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [userId]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile
  };
};