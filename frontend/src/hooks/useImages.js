import { useState, useEffect, useCallback } from 'react';
import { profileImageService } from '../services/profileImageService';

export const useImages = (userId) => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bannerPhoto, setBannerPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para carregar todas as imagens do usuário
  const loadUserImages = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Usar o método do profileImageService para obter imagens do Firestore
      const images = await profileImageService.getUserImages(userId);
      
      setProfilePhoto(images.profilePhotoURL);
      setBannerPhoto(images.bannerPhotoURL);
      
    } catch (error) {
      console.error('Erro ao carregar imagens do usuário:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Função para atualizar uma imagem específica
  const updateImage = useCallback(async (file, imageType, currentImageId = null) => {
    if (!userId || !file) return null;
    
    try {
      // Validar arquivo antes do upload
      profileImageService.validateFileType(file);
      
      if (imageType === 'profilePhoto') {
        profileImageService.validateFileSize(file, 2); // 2MB para foto de perfil
      } else if (imageType === 'bannerPhoto') {
        profileImageService.validateFileSize(file, 5); // 5MB para banner
      }
      
      let newImageId;
      
      if (imageType === 'profilePhoto') {
        newImageId = await profileImageService.replaceProfilePhoto(file, userId, currentImageId);
      } else if (imageType === 'bannerPhoto') {
        newImageId = await profileImageService.replaceBannerPhoto(file, userId, currentImageId);
      }
      
      // Recarregar as imagens para atualizar o estado
      await loadUserImages();
      
      return newImageId;
    } catch (error) {
      console.error(`Erro ao atualizar ${imageType}:`, error);
      throw error;
    }
  }, [userId, loadUserImages]);

  // Função para limpar cache das imagens
  const clearImages = useCallback(() => {
    setProfilePhoto(null);
    setBannerPhoto(null);
    setError(null);
  }, []);

  // Carregar imagens quando o userId mudar
  useEffect(() => {
    if (userId) {
      loadUserImages();
    }
  }, [userId, loadUserImages]);

  return {
    profilePhoto,
    bannerPhoto,
    loading,
    error,
    loadUserImages,
    updateImage,
    clearImages
  };
};
