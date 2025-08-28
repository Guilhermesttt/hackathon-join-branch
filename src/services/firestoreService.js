import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from './firebase';

// ===== POSTS SERVICE =====
export const postsService = {
  // Create new post
  async createPost(postData) {
    try {
      const postsRef = collection(db, 'posts');
      const docRef = await addDoc(postsRef, {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: [],
        commentCount: 0,
        shares: 0,
        isEdited: false
      });
      
      return { success: true, postId: docRef.id };
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error(`Failed to create post: ${error.message}`);
    }
  },

  // Get posts with pagination
  async getPosts(limitCount = 20, lastDoc = null) {
    try {
      const postsRef = collection(db, 'posts');
      let q = query(
        postsRef,
        where('visibility', '==', 'public'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        _doc: doc // Store document reference for pagination
      }));

      return {
        posts,
        lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
        hasMore: querySnapshot.docs.length === limitCount
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }
  },

  // Get user posts
  async getUserPosts(userId, limitCount = 50) {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(
        postsRef,
        where('userId', '==', userId),
        where('visibility', 'in', ['public', 'private']),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw new Error(`Failed to fetch user posts: ${error.message}`);
    }
  },

  // Update post
  async updatePost(postId, updates) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp(),
        isEdited: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating post:', error);
      throw new Error(`Failed to update post: ${error.message}`);
    }
  },

  // Delete post
  async deletePost(postId) {
    try {
      return await runTransaction(db, async (transaction) => {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await transaction.get(postRef);
        
        if (!postDoc.exists()) {
          throw new Error('Post not found');
        }

        // Delete the post
        transaction.delete(postRef);

        // Delete all comments for this post
        const commentsRef = collection(db, 'comments');
        const commentsQuery = query(commentsRef, where('postId', '==', postId));
        const commentsSnapshot = await getDocs(commentsQuery);
        
        commentsSnapshot.docs.forEach(commentDoc => {
          transaction.delete(commentDoc.ref);
        });

        return { success: true };
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  },

  // Toggle post like
  async togglePostLike(postId, userId) {
    try {
      return await runTransaction(db, async (transaction) => {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await transaction.get(postRef);
        
        if (!postDoc.exists()) {
          throw new Error('Post not found');
        }

        const postData = postDoc.data();
        const likes = postData.likes || [];
        const isLiked = likes.includes(userId);

        if (isLiked) {
          transaction.update(postRef, {
            likes: arrayRemove(userId),
            updatedAt: serverTimestamp()
          });
        } else {
          transaction.update(postRef, {
            likes: arrayUnion(userId),
            updatedAt: serverTimestamp()
          });
        }

        return { success: true, isLiked: !isLiked };
      });
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw new Error(`Failed to toggle like: ${error.message}`);
    }
  },

  // Subscribe to posts real-time
  subscribeToPosts(callback, limitCount = 20) {
    const postsRef = collection(db, 'posts');
    const q = query(
      postsRef,
      where('visibility', '==', 'public'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(posts);
    }, (error) => {
      console.error('Error in posts subscription:', error);
      callback([]);
    });
  }
};

// ===== COMMENTS SERVICE =====
export const commentsService = {
  // Add comment
  async addComment(postId, commentData) {
    try {
      return await runTransaction(db, async (transaction) => {
        const commentsRef = collection(db, 'comments');
        const commentRef = doc(commentsRef);
        
        // Add comment
        transaction.set(commentRef, {
          postId,
          ...commentData,
          createdAt: serverTimestamp(),
          likes: [],
          isHidden: false
        });

        // Update post comment count
        const postRef = doc(db, 'posts', postId);
        transaction.update(postRef, {
          commentCount: increment(1)
        });

        return { success: true, commentId: commentRef.id };
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw new Error(`Failed to add comment: ${error.message}`);
    }
  },

  // Get post comments
  async getPostComments(postId, limitCount = 50) {
    try {
      const commentsRef = collection(db, 'comments');
      const q = query(
        commentsRef,
        where('postId', '==', postId),
        where('isHidden', '==', false),
        orderBy('createdAt', 'asc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }
  },

  // Delete comment
  async deleteComment(commentId) {
    try {
      return await runTransaction(db, async (transaction) => {
        const commentRef = doc(db, 'comments', commentId);
        const commentDoc = await transaction.get(commentRef);
        
        if (!commentDoc.exists()) {
          throw new Error('Comment not found');
        }

        const commentData = commentDoc.data();
        
        // Delete comment
        transaction.delete(commentRef);

        // Update post comment count
        const postRef = doc(db, 'posts', commentData.postId);
        transaction.update(postRef, {
          commentCount: increment(-1)
        });

        return { success: true };
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  },

  // Toggle comment like
  async toggleCommentLike(commentId, userId) {
    try {
      return await runTransaction(db, async (transaction) => {
        const commentRef = doc(db, 'comments', commentId);
        const commentDoc = await transaction.get(commentRef);
        
        if (!commentDoc.exists()) {
          throw new Error('Comment not found');
        }

        const commentData = commentDoc.data();
        const likes = commentData.likes || [];
        const isLiked = likes.includes(userId);

        if (isLiked) {
          transaction.update(commentRef, {
            likes: arrayRemove(userId)
          });
        } else {
          transaction.update(commentRef, {
            likes: arrayUnion(userId)
          });
        }

        return { success: true, isLiked: !isLiked };
      });
    } catch (error) {
      console.error('Error toggling comment like:', error);
      throw new Error(`Failed to toggle comment like: ${error.message}`);
    }
  }
};

// ===== USERS SERVICE =====
export const usersService = {
  // Create user profile
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isProfileComplete: true
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  },

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(`Failed to update user profile: ${error.message}`);
    }
  },

  // Search users
  async searchUsers(searchTerm, limitCount = 20) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        orderBy('displayName'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by search term (client-side for now)
      return users.filter(user => 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }
};

// ===== COMMUNITIES SERVICE =====
export const communitiesService = {
  // Create community
  async createCommunity(communityData) {
    try {
      const communitiesRef = collection(db, 'communities');
      const docRef = await addDoc(communitiesRef, {
        ...communityData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        memberCount: 1,
        postCount: 0,
        members: [communityData.creatorId]
      });
      
      return { success: true, communityId: docRef.id };
    } catch (error) {
      console.error('Error creating community:', error);
      throw new Error(`Failed to create community: ${error.message}`);
    }
  },

  // Get communities
  async getCommunities(limitCount = 20) {
    try {
      const communitiesRef = collection(db, 'communities');
      const q = query(
        communitiesRef,
        orderBy('memberCount', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new Error(`Failed to fetch communities: ${error.message}`);
    }
  },

  // Join community
  async joinCommunity(communityId, userId) {
    try {
      return await runTransaction(db, async (transaction) => {
        const communityRef = doc(db, 'communities', communityId);
        const communityDoc = await transaction.get(communityRef);
        
        if (!communityDoc.exists()) {
          throw new Error('Community not found');
        }

        const communityData = communityDoc.data();
        const members = communityData.members || [];
        
        if (members.includes(userId)) {
          throw new Error('User already a member');
        }

        transaction.update(communityRef, {
          members: arrayUnion(userId),
          memberCount: increment(1),
          updatedAt: serverTimestamp()
        });

        return { success: true };
      });
    } catch (error) {
      console.error('Error joining community:', error);
      throw new Error(`Failed to join community: ${error.message}`);
    }
  },

  // Leave community
  async leaveCommunity(communityId, userId) {
    try {
      return await runTransaction(db, async (transaction) => {
        const communityRef = doc(db, 'communities', communityId);
        const communityDoc = await transaction.get(communityRef);
        
        if (!communityDoc.exists()) {
          throw new Error('Community not found');
        }

        transaction.update(communityRef, {
          members: arrayRemove(userId),
          memberCount: increment(-1),
          updatedAt: serverTimestamp()
        });

        return { success: true };
      });
    } catch (error) {
      console.error('Error leaving community:', error);
      throw new Error(`Failed to leave community: ${error.message}`);
    }
  }
};

// ===== MOOD SERVICE =====
export const moodService = {
  // Record mood
  async recordMood(userId, moodData) {
    try {
      const moodsRef = collection(db, 'moods');
      const docRef = await addDoc(moodsRef, {
        userId,
        ...moodData,
        recordedAt: serverTimestamp()
      });
      
      return { success: true, moodId: docRef.id };
    } catch (error) {
      console.error('Error recording mood:', error);
      throw new Error(`Failed to record mood: ${error.message}`);
    }
  },

  // Get user mood history
  async getUserMoodHistory(userId, days = 30) {
    try {
      const moodsRef = collection(db, 'moods');
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const q = query(
        moodsRef,
        where('userId', '==', userId),
        where('recordedAt', '>=', startDate),
        orderBy('recordedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching mood history:', error);
      throw new Error(`Failed to fetch mood history: ${error.message}`);
    }
  }
};

// ===== NOTIFICATIONS SERVICE =====
export const notificationsService = {
  // Create notification
  async createNotification(notificationData) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const docRef = await addDoc(notificationsRef, {
        ...notificationData,
        createdAt: serverTimestamp(),
        read: false
      });
      
      return { success: true, notificationId: docRef.id };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error(`Failed to create notification: ${error.message}`);
    }
  },

  // Get user notifications
  async getUserNotifications(userId, limitCount = 50) {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
  },

  // Subscribe to user notifications
  subscribeToUserNotifications(userId, callback) {
    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('recipientId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(notifications);
    }, (error) => {
      console.error('Error in notifications subscription:', error);
      callback([]);
    });
  }
};

// ===== UTILITY FUNCTIONS =====
export const firestoreUtils = {
  // Convert Firestore timestamp to Date
  convertTimestamp(timestamp) {
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate();
    }
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000);
    }
    return timestamp instanceof Date ? timestamp : new Date(timestamp);
  },

  // Format relative time
  formatRelativeTime(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  },

  // Batch operations helper
  async batchOperation(operations) {
    try {
      const batch = writeBatch(db);
      
      operations.forEach(operation => {
        const { type, ref, data } = operation;
        
        switch (type) {
          case 'set':
            batch.set(ref, data);
            break;
          case 'update':
            batch.update(ref, data);
            break;
          case 'delete':
            batch.delete(ref);
            break;
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      console.error('Error in batch operation:', error);
      throw new Error(`Batch operation failed: ${error.message}`);
    }
  }
};

export default {
  postsService,
  commentsService,
  usersService,
  communitiesService,
  moodService,
  notificationsService,
  firestoreUtils
};