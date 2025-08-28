import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreVertical,
  User,
  Clock,
  Hash,
  Send,
  Flag,
  Edit3,
  Trash2,
  X,
  Smile
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { usePosts } from '../hooks/usePosts';
import CommentsThread from './CommentsThread';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const { togglePostLike, isPostLiked, deletePost: deletePostFromHook } = usePosts();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigate('/login');
          return;
        }

        setUser(currentUser);
        
        // Get user data
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
        }

        // Get post data
        const postRef = doc(db, 'posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (postSnap.exists()) {
          const postData = postSnap.data();
          const formattedPost = {
            id: postSnap.id,
            ...postData,
            createdAt: postData.createdAt?.toDate() || new Date(),
            updatedAt: postData.updatedAt?.toDate()
          };
          
          setPost(formattedPost);
          setIsAuthor(formattedPost.userId === currentUser.uid);
        } else {
          navigate('/home');
          return;
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, navigate]);

  const handleLikePost = async () => {
    if (!post) return;
    
    await togglePostLike(post.id);
  };

  const handleDeletePost = async () => {
    if (!post) return;
    
    try {
      const success = await deletePostFromHook(post.id);
      if (success) {
        navigate('/home');
      }
    } catch (error) {
      console.error('Erro ao deletar post:', error);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}m atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return timestamp.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loading-spinner"></div>
        <div className="text-white ml-3">Carregando post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Post não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            
            {isAuthor && (
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 top-full mt-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                    <button
                      onClick={() => {
                        setShowActions(false);
                        // TODO: Implement edit functionality
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 flex items-center space-x-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowActions(false);
                        if (window.confirm('Tem certeza que deseja deletar este post?')) {
                          handleDeletePost();
                        }
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Deletar</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
          {/* Post Header */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              {post.avatar ? (
                <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
              ) : (
                <User className="w-6 h-6 text-white/70" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-white">{post.author}</h3>
                {post.isAnonymous && (
                  <span className="text-xs bg-white/20 text-white/70 px-2 py-1 rounded-full">
                    Anônimo
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-white/50">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(post.createdAt)}</span>
                </div>
                
                {post.isEdited && (
                  <span className="text-white/30">(editado)</span>
                )}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-6">
            <p className="text-white/90 text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Post Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 bg-white/10 text-white/70 px-3 py-1 rounded-full text-sm"
                >
                  <Hash className="w-3 h-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleLikePost}
                className={`flex items-center space-x-2 transition-colors ${
                  isPostLiked(post.id)
                    ? 'text-red-400'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isPostLiked(post.id) ? 'fill-current' : ''}`} />
                <span>{Array.isArray(post.likes) ? post.likes.length : 0}</span>
              </button>
              
              <div className="flex items-center space-x-2 text-white/50">
                <MessageCircle className="w-5 h-5" />
                <span>{post.commentCount || 0}</span>
              </div>
              
              <button className="flex items-center space-x-2 text-white/50 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
                <span>{post.shares || 0}</span>
              </button>
            </div>
            
            <button className="text-white/50 hover:text-white transition-colors">
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <h4 className="text-white font-semibold text-lg mb-6">
            Comentários ({post.commentCount || 0})
          </h4>
          
          <CommentsThread postId={postId} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
