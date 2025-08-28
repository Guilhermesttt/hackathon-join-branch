import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

class ProfileImageService {
  // Upload de foto de perfil (armazenar como base64 no Firestore)
  async uploadProfilePhoto(file, userId) {
    if (!file) throw new Error('Arquivo inválido');
    if (!userId) throw new Error('ID de usuário ausente');

    try {
      // Converter arquivo para base64
      const base64Image = await this.fileToBase64(file);
      
      // Criar ID único para a imagem
      const imageId = `profile_${userId}_${Date.now()}`;
      
      // Atualizar perfil do usuário no Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        profilePhotoId: imageId,
        profilePhotoData: base64Image,
        updatedAt: new Date()
      });
      
      return {
        imageId,
        success: true
      };
    } catch (error) {
      console.error('Erro ao fazer upload da foto de perfil:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  // Upload de banner (armazenar como base64 no Firestore)
  async uploadBannerPhoto(file, userId) {
    if (!file) throw new Error('Arquivo inválido');
    if (!userId) throw new Error('ID de usuário ausente');

    try {
      // Converter arquivo para base64
      const base64Image = await this.fileToBase64(file);
      
      // Criar ID único para a imagem
      const imageId = `banner_${userId}_${Date.now()}`;
      
      // Atualizar perfil do usuário no Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        bannerPhotoId: imageId,
        bannerPhotoData: base64Image,
        updatedAt: new Date()
      });
      
      return {
        imageId,
        success: true
      };
    } catch (error) {
      console.error('Erro ao fazer upload do banner:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  // Substituir foto de perfil
  async replaceProfilePhoto(file, userId, currentImageId = null) {
    try {
      // Fazer upload da nova imagem
      const result = await this.uploadProfilePhoto(file, userId);
      return result.imageId;
    } catch (error) {
      console.error('Erro ao substituir foto de perfil:', error);
      throw error;
    }
  }

  // Substituir banner
  async replaceBannerPhoto(file, userId, currentImageId = null) {
    try {
      // Fazer upload da nova imagem
      const result = await this.uploadBannerPhoto(file, userId);
      return result.imageId;
    } catch (error) {
      console.error('Erro ao substituir banner:', error);
      throw error;
    }
  }

  // Deletar foto de perfil
  async deleteProfilePhoto(userId, imageId) {
    try {
      // Atualizar perfil do usuário removendo a imagem
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        profilePhotoId: null,
        profilePhotoData: null,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar foto de perfil:', error);
      throw error;
    }
  }

  // Deletar banner
  async deleteBannerPhoto(userId, imageId) {
    try {
      // Atualizar perfil do usuário removendo a imagem
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        bannerPhotoId: null,
        bannerPhotoData: null,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
      throw error;
    }
  }

  // Obter dados da imagem do Firestore
  async getImageFromFirestore(imageId, userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        
        if (imageId === userData.profilePhotoId) {
          return userData.profilePhotoData;
        } else if (imageId === userData.bannerPhotoId) {
          return userData.bannerPhotoData;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter imagem do Firestore:', error);
      return null;
    }
  }

  // Obter todas as imagens do usuário
  async getUserImages(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return {
          profilePhotoURL: userData.profilePhotoData || null,
          bannerPhotoURL: userData.bannerPhotoData || null,
          profilePhotoId: userData.profilePhotoId || null,
          bannerPhotoId: userData.bannerPhotoId || null
        };
      }
      
      return {
        profilePhotoURL: null,
        bannerPhotoURL: null,
        profilePhotoId: null,
        bannerPhotoId: null
      };
    } catch (error) {
      console.error('Erro ao obter imagens do usuário:', error);
      return {
        profilePhotoURL: null,
        bannerPhotoURL: null,
        profilePhotoId: null,
        bannerPhotoId: null
      };
    }
  }

  // Função auxiliar para converter arquivo para base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Função para validar tamanho do arquivo
  validateFileSize(file, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`Arquivo muito grande. Máximo permitido: ${maxSizeMB}MB`);
    }
    return true;
  }

  // Função para validar tipo do arquivo
  validateFileType(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado. Use apenas imagens (JPEG, PNG, GIF, WebP)');
    }
    return true;
  }
}

export const profileImageService = new ProfileImageService();
