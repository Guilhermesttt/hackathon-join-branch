import React, { useState, useRef } from 'react';
import { Camera, Save, X, User, AtSign, Phone, Calendar, FileText, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../hooks/useFirestore';
import { storageService } from '../../services/storageService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProfileEditor = ({ isOpen, onClose, onSaved }) => {
  const { user } = useAuth();
  const { updateProfile } = useUserProfile(user?.uid);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.profileData?.username || '',
    bio: user?.profileData?.bio || '',
    phone: user?.profileData?.phone || '',
    birthDate: user?.profileData?.birthDate || '',
    location: user?.profileData?.location || '',
    website: user?.profileData?.website || ''
  });
  
  const [profileImage, setProfileImage] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(user?.photoURL || null);
  const [bannerPreview, setBannerPreview] = useState(user?.profileData?.bannerURL || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ profile: 0, banner: 0 });
  const [error, setError] = useState('');
  
  const profileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        storageService.validateFile(file, 5); // 5MB limit
        setProfileImage(file);
        
        const reader = new FileReader();
        reader.onload = (e) => setProfilePreview(e.target.result);
        reader.readAsDataURL(file);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleBannerImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        storageService.validateFile(file, 10); // 10MB limit
        setBannerImage(file);
        
        const reader = new FileReader();
        reader.onload = (e) => setBannerPreview(e.target.result);
        reader.readAsDataURL(file);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfilePreview(user?.photoURL || null);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerPreview(user?.profileData?.bannerURL || null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.displayName.trim()) {
      setError('Nome é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let profilePhotoURL = user?.photoURL;
      let bannerPhotoURL = user?.profileData?.bannerURL;

      // Upload profile image if selected
      if (profileImage) {
        const result = await storageService.uploadProfilePhoto(
          profileImage,
          user.uid,
          (progress) => setUploadProgress(prev => ({ ...prev, profile: progress }))
        );
        
        if (result.success) {
          profilePhotoURL = result.downloadURL;
        }
      }

      // Upload banner image if selected
      if (bannerImage) {
        const result = await storageService.uploadBannerPhoto(
          bannerImage,
          user.uid,
          (progress) => setUploadProgress(prev => ({ ...prev, banner: progress }))
        );
        
        if (result.success) {
          bannerPhotoURL = result.downloadURL;
        }
      }

      // Update profile data
      const profileUpdates = {
        ...formData,
        photoURL: profilePhotoURL,
        bannerURL: bannerPhotoURL
      };

      const success = await updateProfile(profileUpdates);
      
      if (success) {
        onSaved?.(profileUpdates);
        onClose();
      }
    } catch (err) {
      setError('Erro ao salvar perfil. Tente novamente.');
      console.error('Error saving profile:', err);
    } finally {
      setIsSubmitting(false);
      setUploadProgress({ profile: 0, banner: 0 });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Editar Perfil</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner Image */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Imagem de Banner
            </label>
            
            <div className="relative">
              <div className="w-full h-32 bg-white/10 border-2 border-dashed border-white/20 rounded-lg overflow-hidden">
                {bannerPreview ? (
                  <img 
                    src={bannerPreview} 
                    alt="Banner preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60 text-sm">Clique para selecionar banner</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="bg-black/50 hover:bg-black/70"
                >
                  <Camera className="w-5 h-5" />
                </Button>
                
                {bannerPreview && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={removeBannerImage}
                    disabled={isSubmitting}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {isSubmitting && bannerImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <LoadingSpinner size="lg" className="mb-2" />
                    <p>Enviando banner... {Math.round(uploadProgress.banner)}%</p>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              onChange={handleBannerImageSelect}
              className="hidden"
              disabled={isSubmitting}
            />
          </div>

          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Foto de Perfil
            </label>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden">
                  {profilePreview ? (
                    <img 
                      src={profilePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-12 h-12 text-white/40" />
                    </div>
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => profileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
                
                {isSubmitting && profileImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <p className="text-white/60 text-sm mb-2">
                  Selecione uma foto para seu perfil
                </p>
                {profilePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeProfileImage}
                    disabled={isSubmitting}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remover foto
                  </Button>
                )}
              </div>
            </div>
            
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageSelect}
              className="hidden"
              disabled={isSubmitting}
            />
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome *"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              leftIcon={User}
              disabled={isSubmitting}
              required
            />
            
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="seu_username"
              leftIcon={AtSign}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Biografia
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={3}
              placeholder="Conte um pouco sobre você..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
              maxLength={200}
              disabled={isSubmitting}
            />
            <p className="text-xs text-white/50 mt-1">
              {formData.bio.length}/200 caracteres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(11) 99999-9999"
              leftIcon={Phone}
              disabled={isSubmitting}
            />
            
            <Input
              label="Data de Nascimento"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              leftIcon={Calendar}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Localização"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="São Paulo, SP"
              disabled={isSubmitting}
            />
            
            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://seusite.com"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || !formData.displayName.trim()}
              loading={isSubmitting}
              leftIcon={Save}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;