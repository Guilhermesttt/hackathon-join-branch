import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowLeft, Phone, Calendar, Brain, AtSign } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('cliente'); // 'cliente' | 'psicologo'
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    birthDate: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Campos do psicólogo
    crp: '',
    specialty: '',
    yearsExperience: '',
    acceptsOnline: false,
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.name || !formData.username || !formData.email || !formData.birthDate || !formData.phone || !formData.password || !formData.confirmPassword) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
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
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Atualizar perfil do usuário
      await updateProfile(user, {
        displayName: formData.name
      });

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName: formData.name,
        username: formData.username.toLowerCase(),
        email: formData.email,
        birthDate: formData.birthDate,
        phone: formData.phone,
        role: role,
        createdAt: serverTimestamp(),
        // Campos específicos do psicólogo
        ...(role === 'psicologo' && {
          crp: formData.crp,
          specialty: formData.specialty,
          yearsExperience: formData.yearsExperience,
          acceptsOnline: formData.acceptsOnline,
          bio: formData.bio
        })
      });

      alert('Conta criada com sucesso!');
      navigate('/connected');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-white">
      {/* Light rays component simulation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent transform-gpu origin-top"
            style={{
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              animation: `pulse ${2 + i * 0.5}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md z-10 animate-fade-in animate-slide-up">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="absolute -top-2 -left-2 p-2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12 group"
          aria-label="Voltar para início"
          onMouseEnter={() => setHoveredButton('back')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <ArrowLeft className={`w-6 h-6 transition-all duration-300 ${hoveredButton === 'back' ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
        </button>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md hover:scale-110 hover:rotate-12 transition-all duration-500 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group cursor-pointer">
              <img 
                src="/Logo-Sereno3.png" 
                alt="Sereno Logo" 
                className="w-full h-full object-contain p-1"
                loading="eager"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1 hover:text-white/90 transition-colors duration-300">Sereno</h1>
          <p className="text-white/60 text-sm hover:text-white/80 transition-colors duration-300">Crie sua conta e comece hoje</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] group">
          <div className="mb-4">
            <h2 className="text-xl font-light text-white mb-1 group-hover:text-white/95 transition-colors duration-300">Criar Conta</h2>
            <p className="text-white/60 text-sm group-hover:text-white/70 transition-colors duration-300">Leva menos de 2 minutos</p>
          </div>

          {/* User Type Toggle */}
          <div className="mb-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="w-3 h-3 text-white/40 animate-pulse" />
              <span className="text-xs text-white/60">Tipo de usuário:</span>
              <Sparkles className="w-3 h-3 text-white/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="flex bg-white/10 rounded-lg p-1 border border-white/20 hover:border-white/30 transition-all duration-300 hover:bg-white/15">
              <button
                type="button"
                onClick={() => setRole('cliente')}
                className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-md transition-all duration-300 text-sm group ${
                  role === 'cliente' 
                    ? 'bg-white text-black shadow-lg scale-105 shadow-white/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <User className="w-3 h-3 mr-1.5 transition-all duration-300 group-hover:scale-110" />
                Cliente
              </button>
              <button
                type="button"
                onClick={() => setRole('psicologo')}
                className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-md transition-all duration-300 text-sm group ${
                  role === 'psicologo' 
                    ? 'bg-white text-black shadow-lg scale-105 shadow-white/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <Brain className="w-3 h-3 mr-1.5 transition-all duration-300 group-hover:scale-110" />
                Psicólogo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-light text-white/80">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="username" className="block text-xs font-light text-white/80">Username</label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                  placeholder="seu_usuario"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-light text-white/80">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="birthDate" className="block text-xs font-light text-white/80">Data de Nascimento</label>
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
              <label htmlFor="phone" className="block text-xs font-light text-white/80">Telefone</label>
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

            {/* Campos específicos para Psicólogo */}
            {role === 'psicologo' && (
              <>
                <div className="space-y-1">
                  <label htmlFor="crp" className="block text-xs font-light text-white/80">CRP</label>
                  <input
                    type="text"
                    id="crp"
                    name="crp"
                    value={formData.crp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                    placeholder="CRP 00/00000"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="specialty" className="block text-xs font-light text-white/80">Especialidade</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                    placeholder="Ex.: TCC, Ansiedade, Depressão"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="yearsExperience" className="block text-xs font-light text-white/80">Anos de experiência</label>
                    <input
                      type="number"
                      id="yearsExperience"
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                  <label className="flex items-center justify-start gap-2 mt-5">
                    <input
                      type="checkbox"
                      name="acceptsOnline"
                      checked={formData.acceptsOnline}
                      onChange={handleInputChange}
                      className="w-3 h-3 rounded border-white/30 bg-black/40 text-white focus:ring-white/30 focus:ring-2"
                    />
                    <span className="text-xs text-white/80">Atende online</span>
                  </label>
                </div>
                <div className="space-y-1">
                  <label htmlFor="bio" className="block text-xs font-light text-white/80">Bio (opcional)</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="2"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                    placeholder="Fale brevemente sobre sua abordagem."
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-light text-white/80">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-xs font-light text-white/80">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200 text-sm"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-2.5 px-4 bg-white text-black hover:bg-white/90 disabled:bg-white/60 font-medium rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(255,255,255,0.3)] disabled:scale-100 disabled:cursor-not-allowed shadow-lg text-sm group overflow-hidden relative"
              onMouseEnter={() => setHoveredButton('submit')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Shimmer effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-1000 ${
                hoveredButton === 'submit' && !isLoading ? 'translate-x-full' : ''
              }`}></div>
              
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                  Criando...
                </div>
              ) : (
                <span className="relative z-10">Criar Conta</span>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-white/70 text-sm">
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:scale-105 inline-block"
              >
                Fazer login
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-white/50 text-xs animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="hover:text-white/70 transition-colors duration-300 cursor-default">
            Conecte-se, Entenda-se, <span className="text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300">Evolua.</span>
          </p>
        </div>
      </div>


    </div>
  );
};

export default Register;
