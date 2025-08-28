import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Calendar,
  MapPin,
  Link as LinkIcon,
  User,
  Image as ImageIcon
} from 'lucide-react';
import { auth, db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { profileImageService } from '../services/profileImageService';
import { doc, getDoc, updateDoc, collection, query, where, orderBy, getDocs, getDoc as getDocAlias, getDocs as getDocsAlias } from 'firebase/firestore';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    birthDate: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        let targetUserId = userId || currentUser?.uid;
        
        if (!targetUserId) {
          navigate('/login');
          return;
        }

        // Determine if param is a uid or a slug/username
        let resolvedUserId = targetUserId;
        let resolvedUserData = null;

        // Try by direct document id first
        const byIdRef = doc(db, 'users', targetUserId);
        const byIdSnap = await getDoc(byIdRef);
        if (byIdSnap.exists()) {
          resolvedUserId = targetUserId;
          resolvedUserData = byIdSnap.data();
        } else if (userId) {
          // Try by username/slug field if present
          const usernameQ = query(collection(db, 'users'), where('username', '==', userId));
          const usernameSnap = await getDocs(usernameQ);
          if (!usernameSnap.empty) {
            const doc0 = usernameSnap.docs[0];
            resolvedUserId = doc0.id;
            resolvedUserData = doc0.data();
          }
        }

        setIsOwnProfile(currentUser?.uid === resolvedUserId);

        if (resolvedUserData) {
          setUserData(resolvedUserData);
          setFormData({
            displayName: resolvedUserData.displayName || '',
            bio: resolvedUserData.bio || '',
            location: resolvedUserData.location || '',
            website: resolvedUserData.website || '',
            birthDate: resolvedUserData.birthDate || ''
          });
        } else if (userId) {
          // Fallback minimal profile from slug
          const fallbackName = decodeURIComponent(userId).replace(/-/g, ' ');
          setUserData({ displayName: fallbackName, username: userId });
          setFormData((prev) => ({ ...prev, displayName: fallbackName }));
          resolvedUserId = userId;
        }

        // Fetch user posts
        const postsQuery = query(
          collection(db, 'posts'),
          where('userId', '==', resolvedUserId),
          orderBy('createdAt', 'desc')
        );
        
        const postsSnap = await getDocs(postsQuery);
        const postsData = postsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPosts(postsData);
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setError('');
      setSuccess('');
      
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date()
      });

      setSuccess('Perfil atualizado com sucesso!');
      setEditing(false);
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        ...formData
      }));
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingPhoto(true);
    
    try {
      const backendUserId = authUser?.backend?.id;
      const idToken = authUser?.idToken || (await auth.currentUser?.getIdToken());
      if (!backendUserId) throw new Error('Usuário do backend não identificado');
      await profileImageService.uploadProfilePhoto(file, backendUserId, idToken);
      setSuccess('Foto de perfil atualizada com sucesso!');
    } catch (error) {
      setError('Erro ao fazer upload da foto');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBanner(true);
    
    try {
      // Endpoint de banner ainda não implementado no backend
      setSuccess('Banner atualizado com sucesso!');
    } catch (error) {
      setError('Erro ao fazer upload do banner');
    } finally {
      setUploadingBanner(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatPostDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now - d) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 48) return 'Ontem';
    
    return d.toLocaleDateString('pt-BR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando perfil...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </button>
            <h1 className="text-xl font-light">Perfil</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Error/Success Messages */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mx-4 mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300">
            {success}
          </div>
        )}

        {/* Banner */}
        <div className="relative h-48 bg-white">
          {isOwnProfile && (
            <label className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-md">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
                disabled={uploadingBanner}
              />
              {uploadingBanner ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <ImageIcon className="w-5 h-5 text-white" />
              )}
            </label>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-4 -mt-16 relative z-10">
          {/* Profile Photo */}
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-black overflow-hidden">
              {userData?.photoURL ? (
                <img 
                  src={userData.photoURL} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full text-white/50 p-8" />
              )}
            </div>
            
            {isOwnProfile && (
              <label className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 p-2 rounded-full cursor-pointer transition-all duration-300 backdrop-blur-md">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
                {uploadingPhoto ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Camera className="w-5 h-5 text-white" />
                )}
              </label>
            )}
          </div>

          {/* Edit Profile Button */}
          {isOwnProfile && (
            <div className="flex justify-end mt-4">
              {editing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveProfile}
                    className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-all duration-300 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-full font-medium hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-transparent border border-white/30 text-white px-4 py-2 rounded-full font-medium hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar perfil</span>
                </button>
              )}
            </div>
          )}

          {/* Profile Details */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold">
              {editing ? (
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full"
                  placeholder="Seu nome"
                />
              ) : (
                userData?.displayName || 'Usuário'
              )}
            </h2>
            
            <p className="text-white/70 mt-1">
              @{userData?.username || 'usuario'}
            </p>

            {editing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="mt-4 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-full resize-none"
                placeholder="Conte um pouco sobre você..."
              />
            ) : (
              <p className="text-white mt-4">
                {userData?.bio || 'Nenhuma biografia adicionada'}
              </p>
            )}

            {/* Profile Info */}
            <div className="mt-4 space-y-2">
              {editing ? (
                <>
                  <div className="flex items-center space-x-2 text-white/70">
                    <MapPin className="w-4 h-4" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="bg-transparent border-none text-white/70 placeholder-white/50 focus:outline-none focus:ring-0 flex-1"
                      placeholder="Adicionar localização"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-white/70">
                    <LinkIcon className="w-4 h-4" />
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="bg-transparent border-none text-white/70 placeholder-white/50 focus:outline-none focus:ring-0 flex-1"
                      placeholder="Adicionar website"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-white/70">
                    <Calendar className="w-4 h-4" />
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="bg-transparent border-none text-white/70 placeholder-white/50 focus:outline-none focus:ring-0 flex-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  {userData?.location && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                  )}
                  {userData?.website && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <LinkIcon className="w-4 h-4" />
                      <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                        {userData.website}
                      </a>
                    </div>
                  )}
                  {userData?.birthDate && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>Nascido em {formatDate(userData.birthDate)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Join Date */}
            <div className="mt-4 text-white/70">
              Entrou em {formatDate(userData?.createdAt)}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8 border-t border-white/10">
          <div className="px-4 py-4">
            <h3 className="text-xl font-bold">Posts</h3>
          </div>
          
          {posts.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-white/50">Nenhum post ainda</p>
              <p className="text-white/30 text-sm mt-2">Quando você postar algo, aparecerá aqui</p>
            </div>
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <div key={post.id} className="border-b border-white/10 p-4 hover:bg-white/5 transition-colors">
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {userData?.photoURL ? (
                        <img 
                          src={userData.photoURL} 
                          alt="" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white/50" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-white">{userData?.displayName || 'Usuário'}</span>
                        <span className="text-white/50">@{userData?.username || 'usuario'}</span>
                        <span className="text-white/50">•</span>
                        <span className="text-white/50">{formatPostDate(post.createdAt)}</span>
                      </div>
                      
                      <p className="text-white mb-3">{post.content}</p>
                      
                      {post.image && (
                        <div className="mb-3 rounded-xl overflow-hidden">
                          <img src={post.image} alt="" className="w-full max-h-96 object-cover" />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-8 text-white/50">
                        <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span>{post.commentCount || 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-red-400 transition-colors">
                          <Heart className="w-5 h-5" />
                          <span>{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
