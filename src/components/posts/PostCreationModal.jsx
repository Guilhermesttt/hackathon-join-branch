import React, { useState, useRef } from 'react';
import { X, Image, Hash, Eye, EyeOff, Send, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../hooks/useFirestore';
import { storageService } from '../../services/storageService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';

const PostCreationModal = ({ isOpen, onClose, onPostCreated }) => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        storageService.validateFile(file, 15); // 15MB limit
        setSelectedImage(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
        setError('');
      } catch (err) {
        setError(err.message);
        setSelectedImage(null);
        setImagePreview(null);
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor, escreva algo para postar.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageUrl = null;
      
      // Upload image if selected
      if (selectedImage) {
        const uploadResult = await storageService.uploadPostImage(
          selectedImage,
          user.uid,
          `temp_${Date.now()}`, // Temporary ID, will be replaced with actual post ID
          (progress) => setUploadProgress(progress)
        );
        
        if (uploadResult.success) {
          imageUrl = uploadResult.downloadURL;
        }
      }

      const postData = {
        content: content.trim(),
        tags: tags.trim() ? tags.trim().split(',').map(tag => tag.trim().replace('#', '')) : [],
        isAnonymous: visibility === 'anonymous',
        visibility: visibility,
        userId: user.uid,
        author: visibility === 'anonymous' ? 'Usuário Anônimo' : (user.displayName || user.email || 'Usuário'),
        avatar: visibility === 'anonymous' ? null : user.photoURL,
        imageUrl
      };

      const postId = await createPost(postData);
      
      if (postId) {
        // Reset form
        setContent('');
        setTags('');
        setVisibility('public');
        removeImage();
        setUploadProgress(0);
        
        // Call callback
        onPostCreated?.(postData);
        onClose();
      }
    } catch (err) {
      setError('Erro ao criar post. Tente novamente.');
      console.error('Error creating post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVisibilityIcon = () => {
    switch (visibility) {
      case 'public':
        return <Eye className="w-4 h-4" />;
      case 'private':
        return <EyeOff className="w-4 h-4" />;
      case 'anonymous':
        return <EyeOff className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  const getVisibilityDescription = () => {
    switch (visibility) {
      case 'public':
        return 'Todos podem ver este post';
      case 'private':
        return 'Apenas você pode ver este post';
      case 'anonymous':
        return 'Post anônimo, não aparecerá no seu perfil';
      default:
        return 'Todos podem ver este post';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-medium text-white">Criar Novo Post</h3>
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
          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você gostaria de compartilhar hoje?"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 min-h-[120px]"
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-white/50">
                {content.length}/1000 caracteres
              </span>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Imagem (opcional)
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={removeImage}
                  className="absolute top-2 right-2"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                {isSubmitting && selectedImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <LoadingSpinner size="lg" className="mb-2" />
                      <p>Enviando imagem... {Math.round(uploadProgress)}%</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-white/30 hover:bg-white/5 transition-colors"
              >
                <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60">Clique para selecionar uma imagem</p>
                <p className="text-white/40 text-sm mt-1">Máximo 15MB</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isSubmitting}
            />
          </div>

          {/* Tags Input */}
          <div>
            <Input
              label="Tags (opcional)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ansiedade, bem-estar, terapia"
              leftIcon={Hash}
              helperText="Separe as tags com vírgulas"
              disabled={isSubmitting}
            />
          </div>

          {/* Visibility Options */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Visibilidade do Post
            </label>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'public', label: 'Público', icon: Eye },
                { value: 'private', label: 'Privado', icon: EyeOff },
                { value: 'anonymous', label: 'Anônimo', icon: EyeOff }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setVisibility(option.value)}
                  disabled={isSubmitting}
                  className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-2 ${
                    visibility === option.value
                      ? 'border-white/50 bg-white/20 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
            
            <p className="text-xs text-white/60 mt-2">
              {getVisibilityDescription()}
            </p>
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
              disabled={isSubmitting || !content.trim()}
              loading={isSubmitting}
              leftIcon={Send}
            >
              {isSubmitting ? 'Postando...' : 'Postar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreationModal;