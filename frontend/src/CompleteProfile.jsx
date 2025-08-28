import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Phone, Calendar, ArrowLeft, User, AtSign, Camera, Image, FileText, Upload, X, ArrowRight, CheckCircle } from 'lucide-react';
import LightRays from './Components/LightRays';
import { useAuth } from './contexts/AuthContext';
import { notificationService } from './services/firebaseService';

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    birthDate: '',
    phone: '',
    bio: '',
    profilePhotoURL: '',
    bannerPhotoURL: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [previewProfile, setPreviewProfile] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);
  const navigate = useNavigate();
  
  const profilePhotoRef = useRef();
  const bannerPhotoRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Verificar se o usuário já tem dados completos
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          
          // Se já tem username, telefone e data de nascimento, redirecionar para home
          if (data.username && data.phone && data.birthDate) {
            navigate('/home');
            return;
          }
        }
      } else {
        // Se não há usuário logado, redirecionar para login
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (2MB máximo para base64)
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB para upload direto.');
        return;
      }
      
      // Converter para base64 para evitar problemas de CORS
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, profilePhotoURL: base64String }));
          setPreviewProfile(base64String);
        } else {
          setFormData(prev => ({ ...prev, bannerPhotoURL: base64String }));
          setPreviewBanner(base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type) => {
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, profilePhotoURL: '' }));
      setPreviewProfile(null);
    } else {
      setFormData(prev => ({ ...prev, bannerPhotoURL: '' }));
      setPreviewBanner(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.birthDate || !formData.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validar formato do username (apenas letras, números e underscore)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(formData.username)) {
      alert('O username deve ter entre 3 e 20 caracteres e conter apenas letras, números e underscore (_).');
      return;
    }

    setIsLoading(true);
    
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Salvar dados do usuário no Firestore com base64 das imagens
      const userDataToSave = {
        username: formData.username.toLowerCase(),
        birthDate: formData.birthDate,
        phone: formData.phone,
        bio: formData.bio || '',
        profilePhotoURL: formData.profilePhotoURL || userData?.profilePhotoURL || null,
        bannerPhotoURL: formData.bannerPhotoURL || userData?.bannerPhotoURL || null,
        updatedAt: serverTimestamp(),
        createdAt: userData?.createdAt || serverTimestamp(),
        email: user.email,
        displayName: user.displayName || user.email,
        role: 'cliente', // Role padrão para novos usuários
        isProfileComplete: true
      };
      
      console.log('Salvando dados do usuário:', userDataToSave);
      
      await setDoc(userRef, userDataToSave, { merge: true });
      
      // Criar notificação de boas-vindas
      try {
        await notificationService.createNotification({
          type: 'welcome',
          title: 'Bem-vindo ao Sereno! 🎉',
          message: 'Seu perfil foi criado com sucesso. Comece a explorar a plataforma e conectar-se com outros usuários.',
          recipientId: user.uid,
          senderId: 'system',
          senderName: 'Sereno',
          actionUrl: '/home'
        });
      } catch (error) {
        console.warn('Erro ao criar notificação de boas-vindas:', error);
      }

      console.log('Perfil criado com sucesso!');
      
      // Redirecionar para /connected (sem notificações)
      navigate('/connected');
      
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      alert(`Erro ao salvar os dados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-white">
      <LightRays />

      <div className="relative w-full max-w-2xl z-10">
        <button
          type="button"
          onClick={() => {
            auth.signOut();
            navigate('/login'); 
          }}
          className="absolute -top-2 -left-2 p-2 text-white/80 hover:text-white transition-colors"
          aria-label="Sair e voltar para login"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
              <img 
                src="/Logo-Sereno3.png" 
                alt="Sereno Logo" 
                className="w-full h-full object-contain p-1"
                loading="eager"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1">Sereno</h1>
          <p className="text-white/60 text-sm">Complete seu perfil</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-light text-white mb-2">Bem-vindo, {user.displayName || user.email}!</h2>
            <p className="text-white/60 text-sm">Para continuar, precisamos de algumas informações adicionais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seção de Fotos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-3">Fotos do Perfil (Opcional)</h3>
              
              {/* Banner */}
              <div className="space-y-2">
                <label className="block text-sm font-light text-white/80">Foto do Banner</label>
                <div className="relative">
                  <div className="w-full h-32 bg-white/10 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                    {previewBanner ? (
                      <img 
                        src={previewBanner} 
                        alt="Preview do banner" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Image className="w-8 h-8 text-white/40 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">Clique para selecionar uma imagem</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Botão de upload */}
                  <button
                    type="button"
                    onClick={() => bannerPhotoRef.current?.click()}
                    className="absolute inset-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Upload className="w-6 h-6 text-white" />
                  </button>
                  
                  {/* Botão de remover */}
                  {previewBanner && (
                    <button
                      type="button"
                      onClick={() => removeImage('banner')}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  
                  <input
                    ref={bannerPhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'banner')}
                    className="hidden"
                  />
                </div>
                
                <p className="text-xs text-white/50">Tamanho máximo: 2MB. Formatos: JPG, PNG, GIF</p>
              </div>

              {/* Foto de Perfil */}
              <div className="space-y-2">
                <label className="block text-sm font-light text-white/80">Foto de Perfil</label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white/10 border-2 border-dashed border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                      {previewProfile ? (
                        <img 
                          src={previewProfile} 
                          alt="Preview da foto de perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white/40" />
                      )}
                    </div>
                    
                    {/* Botão de upload */}
                    <button
                      type="button"
                      onClick={() => profilePhotoRef.current?.click()}
                      className="absolute inset-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full"
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Botão de remover */}
                    {previewProfile && (
                      <button
                        type="button"
                        onClick={() => removeImage('profile')}
                        className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    
                    <input
                      ref={profilePhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e, 'profile')}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/60 text-sm">Selecione uma foto para seu perfil</p>
                  </div>
                </div>
                <p className="text-xs text-white/50">Tamanho máximo: 2MB. Formatos: JPG, PNG, GIF</p>
              </div>
            </div>

            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white mb-3">Informações Básicas</h3>
              
              <div className="space-y-1">
                <label htmlFor="username" className="block text-xs font-light text-white/80">Username *</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                    placeholder="seu_username"
                    required
                    minLength={3}
                    maxLength={20}
                    pattern="[a-zA-Z0-9_]{3,20}"
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">3-20 caracteres, apenas letras, números e _</p>
              </div>

              <div className="space-y-1">
                <label htmlFor="birthDate" className="block text-xs font-light text-white/80">Data de Nascimento *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-light text-white/80">Telefone *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="bio" className="block text-xs font-light text-white/80">Biografia</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm resize-none"
                    placeholder="Conte um pouco sobre você..."
                    maxLength={200}
                  />
                </div>
                <p className="text-xs text-white/50 mt-1">{formData.bio.length}/200 caracteres</p>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-2.5 px-4 bg-white text-black hover:bg-white/90 disabled:bg-white/60 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-sm"
            >
              {isLoading ? 'Salvando...' : 'Completar Perfil'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-white/70 text-xs">
              Estes dados são necessários para personalizar sua experiência
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-white/50 text-xs">
          <p>Conecte-se, Entenda-se, <span className="text-white">Evolua.</span></p>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
