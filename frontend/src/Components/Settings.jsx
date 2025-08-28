import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Eye,
  EyeOff,
  Save,
  X,
  Check,
  AlertTriangle,
  ArrowLeft,
  Trash2,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountConfirmation, setDeleteAccountConfirmation] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    username: '',
    displayName: '',
    bio: '',
    location: '',
    website: '',
    language: 'pt-BR'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    messageNotifications: true,
    groupNotifications: true,
    sessionReminders: true,
    moodReminders: true,
    weeklyReports: false
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    allowFriendRequests: true,
    showOnlineStatus: true,
    dataSharing: false
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    fontSize: 'medium',
    compactMode: false,
    animations: true
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // Carregar dados do perfil do usuário autenticado
          const userProfileData = user.profileData || {};
          
          setProfileSettings({
            username: userProfileData.username || user.displayName?.toLowerCase().replace(/\s+/g, '.') || '',
            displayName: user.displayName || userProfileData.displayName || '',
            bio: userProfileData.bio || '',
            location: userProfileData.location || '',
            website: userProfileData.website || '',
            language: userProfileData.language || 'pt-BR'
          });

          // Carregar configurações de notificação (se existirem)
          setNotificationSettings({
            emailNotifications: userProfileData.emailNotifications !== undefined ? userProfileData.emailNotifications : true,
            pushNotifications: userProfileData.pushNotifications !== undefined ? userProfileData.pushNotifications : true,
            messageNotifications: userProfileData.messageNotifications !== undefined ? userProfileData.messageNotifications : true,
            groupNotifications: userProfileData.groupNotifications !== undefined ? userProfileData.groupNotifications : true,
            sessionReminders: userProfileData.sessionReminders !== undefined ? userProfileData.sessionReminders : true,
            moodReminders: userProfileData.moodReminders !== undefined ? userProfileData.moodReminders : true,
            weeklyReports: userProfileData.weeklyReports || false
          });

          // Carregar configurações de privacidade (se existirem)
          setPrivacySettings({
            profileVisibility: userProfileData.profileVisibility || 'public',
            showEmail: userProfileData.showEmail || false,
            showPhone: userProfileData.showPhone || false,
            allowMessages: userProfileData.allowMessages !== undefined ? userProfileData.allowMessages : true,
            allowFriendRequests: userProfileData.allowFriendRequests !== undefined ? userProfileData.allowFriendRequests : true,
            showOnlineStatus: userProfileData.showOnlineStatus !== undefined ? userProfileData.showOnlineStatus : true,
            dataSharing: userProfileData.dataSharing || false
          });

          // Carregar configurações de aparência (se existirem)
          setAppearanceSettings({
            theme: userProfileData.theme || 'dark',
            fontSize: userProfileData.fontSize || 'medium',
            compactMode: userProfileData.compactMode || false,
            animations: userProfileData.animations !== undefined ? userProfileData.animations : true
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setError('Erro ao carregar configurações');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleProfileSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // TODO: Implementar salvamento real no Firebase
      // Por enquanto, simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Configurações de perfil salvas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // TODO: Implementar salvamento real no Firebase
      // Por enquanto, simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Configurações de notificação salvas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handlePrivacySave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // TODO: Implementar salvamento real no Firebase
      // Por enquanto, simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Configurações de privacidade salvas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleAppearanceSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // TODO: Implementar salvamento real no Firebase
      // Por enquanto, simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Configurações de aparência salvas com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setError('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteAccountConfirmation !== 'EXCLUIR') {
      setError('Digite EXCLUIR para confirmar a exclusão da conta');
      return;
    }

    try {
      setDeletingAccount(true);
      setError('');

      if (!user?.uid) {
        throw new Error('Usuário não autenticado');
      }

      // 1. Deletar dados do Firestore
      const userRef = doc(db, 'users', user.uid);
      await deleteDoc(userRef);

      // 2. Deletar posts do usuário
      // TODO: Implementar limpeza de posts, comentários e outras entidades relacionadas

      // 3. Deletar conta do Firebase Auth
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      // 4. Redirecionar para login
      navigate('/login');
      
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setError('Erro ao excluir conta. Tente novamente.');
    } finally {
      setDeletingAccount(false);
    }
  };

  const openDeleteAccountModal = () => {
    setShowDeleteAccountModal(true);
    setDeleteAccountConfirmation('');
    setError('');
  };

  const closeDeleteAccountModal = () => {
    setShowDeleteAccountModal(false);
    setDeleteAccountConfirmation('');
    setError('');
  };

  const handleInputChange = (section, field, value) => {
    switch (section) {
      case 'profile':
        setProfileSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'privacy':
        setPrivacySettings(prev => ({ ...prev, [field]: value }));
        break;
      case 'appearance':
        setAppearanceSettings(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
          <span className="ml-3 text-white/70">Carregando configurações...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
        <h3 className="text-xl text-white/60 mb-2">Usuário não autenticado</h3>
        <p className="text-white/40 mb-6">Faça login para acessar as configurações</p>
        <button 
          onClick={() => navigate('/login')} 
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
        >
          Ir para Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 animation-initial animate-fade-in-up animation-delay-100">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-white">Configurações</h2>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          {[
            { id: 'profile', name: 'Perfil', icon: User },
            { id: 'notifications', name: 'Notificações', icon: Bell },
            { id: 'privacy', name: 'Privacidade', icon: Shield },
            { id: 'appearance', name: 'Aparência', icon: Palette },
            { id: 'account', name: 'Conta', icon: Trash2 }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                  activeSection === tab.id
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-green-300">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Profile Settings */}
      {activeSection === 'profile' && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Configurações do Perfil</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Username da Plataforma
              </label>
              <input
                type="text"
                value={profileSettings.username}
                onChange={(e) => handleInputChange('profile', 'username', e.target.value.toLowerCase())}
                placeholder="Digite seu username"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              />
              <p className="text-white/50 text-xs mt-1">Este será seu identificador único na plataforma</p>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Nome de Exibição
              </label>
              <input
                type="text"
                value={profileSettings.displayName}
                onChange={(e) => handleInputChange('profile', 'displayName', e.target.value)}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Biografia
              </label>
              <textarea
                value={profileSettings.bio}
                onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                rows="3"
                placeholder="Conte um pouco sobre você..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  value={profileSettings.location}
                  onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                  placeholder="Ex: São Paulo, SP"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profileSettings.website}
                  onChange={(e) => handleInputChange('profile', 'website', e.target.value)}
                  placeholder="https://seusite.com"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:ring-2 focus:ring-white focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Idioma
              </label>
              <select
                value={profileSettings.language}
                onChange={(e) => handleInputChange('profile', 'language', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleProfileSave}
                disabled={saving}
                className="px-6 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Perfil</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeSection === 'notifications' && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Configurações de Notificação</h3>
          
          <div className="space-y-6">
            {[
              { key: 'emailNotifications', label: 'Notificações por Email', description: 'Receber notificações importantes por email' },
              { key: 'pushNotifications', label: 'Notificações Push', description: 'Receber notificações no dispositivo' },
              { key: 'messageNotifications', label: 'Mensagens', description: 'Notificar sobre novas mensagens' },
              { key: 'groupNotifications', label: 'Atividade em Grupos', description: 'Notificar sobre atividades nos grupos' },
              { key: 'sessionReminders', label: 'Lembretes de Sessão', description: 'Lembrar sobre sessões agendadas' },
              { key: 'moodReminders', label: 'Lembretes de Humor', description: 'Lembrar de registrar seu humor diário' },
              { key: 'weeklyReports', label: 'Relatórios Semanais', description: 'Receber resumo semanal de atividades' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{setting.label}</h4>
                  <p className="text-white/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings[setting.key]}
                    onChange={(e) => handleInputChange('notifications', setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleNotificationSave}
                disabled={saving}
                className="px-6 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Notificações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      {activeSection === 'privacy' && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Configurações de Privacidade</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Visibilidade do Perfil
              </label>
              <select
                value={privacySettings.profileVisibility}
                onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              >
                <option value="public">Público</option>
                <option value="friends">Apenas Amigos</option>
                <option value="private">Privado</option>
              </select>
            </div>

            {[
              { key: 'showEmail', label: 'Mostrar Email', description: 'Permitir que outros vejam seu email' },
              { key: 'showPhone', label: 'Mostrar Telefone', description: 'Permitir que outros vejam seu telefone' },
              { key: 'allowMessages', label: 'Permitir Mensagens', description: 'Permitir que outros te enviem mensagens' },
              { key: 'allowFriendRequests', label: 'Permitir Solicitações', description: 'Permitir solicitações de amizade' },
              { key: 'showOnlineStatus', label: 'Mostrar Status Online', description: 'Mostrar quando você está online' },
              { key: 'dataSharing', label: 'Compartilhar Dados', description: 'Permitir compartilhamento de dados para pesquisas' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{setting.label}</h4>
                  <p className="text-white/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacySettings[setting.key]}
                    onChange={(e) => handleInputChange('privacy', setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handlePrivacySave}
                disabled={saving}
                className="px-6 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Privacidade</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeSection === 'appearance' && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Configurações de Aparência</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Tema
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'dark', label: 'Escuro', description: 'Tema padrão escuro' },
                  { value: 'light', label: 'Claro', description: 'Tema claro (em breve)' },
                  { value: 'auto', label: 'Automático', description: 'Seguir sistema' }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleInputChange('appearance', 'theme', theme.value)}
                    className={`p-4 rounded-lg border transition-all ${
                      appearanceSettings.theme === theme.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-white font-medium">{theme.label}</div>
                    <div className="text-white/60 text-xs">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Tamanho da Fonte
              </label>
              <select
                value={appearanceSettings.fontSize}
                onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-white focus:border-transparent transition-all"
              >
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
              </select>
            </div>

            {[
              { key: 'compactMode', label: 'Modo Compacto', description: 'Interface mais densa com menos espaçamento' },
              { key: 'animations', label: 'Animações', description: 'Habilitar animações da interface' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{setting.label}</h4>
                  <p className="text-white/60 text-sm">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appearanceSettings[setting.key]}
                    onChange={(e) => handleInputChange('appearance', setting.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleAppearanceSave}
                disabled={saving}
                className="px-6 py-3 bg-white hover:bg-gray-100 disabled:bg-gray-800 disabled:cursor-not-allowed text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar Aparência</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings */}
      {activeSection === 'account' && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-xl font-semibold text-white mb-6">Configurações da Conta</h3>
          
          <div className="space-y-6">
            {/* Danger Zone */}
            <div className="border border-red-500/30 rounded-xl p-6 bg-red-500/5">
              <div className="flex items-center space-x-3 mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
                <h4 className="text-lg font-semibold text-red-400">Zona de Perigo</h4>
              </div>
              
              <p className="text-white/70 mb-4">
                As ações abaixo são irreversíveis e resultarão na perda permanente de todos os seus dados.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h5 className="font-medium text-red-300 mb-2">Excluir Conta Permanentemente</h5>
                  <p className="text-white/60 text-sm mb-4">
                    Esta ação irá:
                  </p>
                  <ul className="text-white/60 text-sm space-y-1 mb-4">
                    <li>• Deletar todos os seus dados pessoais</li>
                    <li>• Remover todos os seus posts e comentários</li>
                    <li>• Excluir seu perfil e configurações</li>
                    <li>• Encerrar sua conta de autenticação</li>
                    <li>• <strong>Esta ação não pode ser desfeita</strong></li>
                  </ul>
                  
                  <button
                    onClick={openDeleteAccountModal}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir Minha Conta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-red-500/30">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Excluir Conta</h3>
                <p className="text-white/60 text-sm">Esta ação é irreversível</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <p className="text-white/70 text-sm">
                  <strong>Atenção:</strong> Ao excluir sua conta, você perderá permanentemente:
                </p>
                <ul className="text-white/60 text-sm mt-2 space-y-1">
                  <li>• Todos os seus posts e comentários</li>
                  <li>• Seu perfil e configurações</li>
                  <li>• Histórico de atividades</li>
                  <li>• Dados de sessões e humor</li>
                </ul>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Digite <strong>EXCLUIR</strong> para confirmar:
                </label>
                <input
                  type="text"
                  value={deleteAccountConfirmation}
                  onChange={(e) => setDeleteAccountConfirmation(e.target.value)}
                  placeholder="EXCLUIR"
                  className="w-full px-4 py-3 bg-white/5 border border-red-500/30 rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={closeDeleteAccountModal}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deletingAccount || deleteAccountConfirmation !== 'EXCLUIR'}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {deletingAccount ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir Conta</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;