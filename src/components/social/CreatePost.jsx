import React, { useState, useRef } from 'react';
import { Image, Hash, Eye, EyeOff, Send, X, Smile, MapPin, Users, Camera, Paperclip } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePosts } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const CreatePost = ({ onPostCreated, className }) => {
  const { user } = useAuth();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mood, setMood] = useState('');
  const fileInputRef = useRef(null);

  const emojis = ['😊', '😢', '😡', '😍', '🤔', '😴', '🎉', '💪', '🙏', '❤️', '👍', '👎', '🔥', '💯', '✨'];
  const moods = [
    { emoji: '😊', label: 'Feliz', value: 'happy' },
    { emoji: '😌', label: 'Calmo', value: 'calm' },
    { emoji: '😔', label: 'Triste', value: 'sad' },
    { emoji: '😰', label: 'Ansioso', value: 'anxious' },
    { emoji: '😡', label: 'Irritado', value: 'angry' },
    { emoji: '🤔', label: 'Pensativo', value: 'thoughtful' }
  ];

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 10MB.');
        return;
      }
      
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addEmoji = (emoji) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Por favor, escreva algo para postar.');
      return;
    }

    if (!user) {
      setError('Você precisa estar logado para postar.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const postData = {
        content: content.trim(),
        tags: tags.trim() ? tags.trim().split(',').map(tag => tag.trim().replace('#', '')) : [],
        isAnonymous: visibility === 'anonymous',
        visibility: visibility,
        userId: user.uid,
        author: visibility === 'anonymous' ? 'Usuário Anônimo' : (user.displayName || user.email || 'Usuário'),
        username: visibility === 'anonymous' ? 'anonimo' : (user.username || 'usuario'),
        avatar: visibility === 'anonymous' ? null : user.photoURL,
        imageUrl: imagePreview, // For now, using base64. In production, upload to storage
        mood: mood
      };

      const postId = await createPost(postData);
      
      if (postId) {
        // Reset form
        setContent('');
        setTags('');
        setVisibility('public');
        setMood('');
        removeImage();
        
        onPostCreated?.(postData);
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
        return <Users className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className={`bg-black border border-white/20 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white/70" />
          )}
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          {/* Content Input */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você está pensando?"
              className="w-full bg-transparent border-none text-white text-xl placeholder-white/50 resize-none focus:outline-none min-h-[100px] leading-relaxed"
              maxLength={1000}
              disabled={isSubmitting}
            />
            
            {/* Character Count */}
            <div className="absolute bottom-2 right-2 text-xs text-white/30">
              {content.length}/1000
            </div>
          </div>

          {/* Mood Selector */}
          {mood && (
            <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-white/70 text-sm">Sentindo-se:</span>
              <span className="text-lg">{moods.find(m => m.value === mood)?.emoji}</span>
              <span className="text-white text-sm font-medium">
                {moods.find(m => m.value === mood)?.label}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMood('')}
                className="ml-auto"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full max-h-64 object-cover rounded-xl border border-white/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Tags Input */}
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Adicione tags (separadas por vírgula)"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Post Options */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              {/* Image Upload */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="text-white/70 hover:text-white"
              >
                <Camera className="w-5 h-5" />
              </Button>
              
              {/* Emoji Picker */}
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  disabled={isSubmitting}
                  className="text-white/70 hover:text-white"
                >
                  <Smile className="w-5 h-5" />
                </Button>
                
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 bg-black border border-white/20 rounded-xl p-3 grid grid-cols-5 gap-2 z-10">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mood Selector */}
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white"
                >
                  <span className="text-lg">😊</span>
                </Button>
                
                {/* Mood dropdown would go here */}
              </div>

              {/* Visibility Selector */}
              <div className="flex items-center space-x-2">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isSubmitting}
                >
                  <option value="public">Público</option>
                  <option value="private">Privado</option>
                  <option value="anonymous">Anônimo</option>
                </select>
                
                <div className="flex items-center space-x-1 text-xs text-white/50">
                  {getVisibilityIcon()}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              loading={isSubmitting}
              size="default"
              className="px-8 font-semibold"
            >
              {isSubmitting ? 'Postando...' : 'Postar'}
            </Button>
          </div>
        </form>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        disabled={isSubmitting}
      />
    </div>
  );
};

export default CreatePost;