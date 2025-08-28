import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, User, Brain } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user' or 'psychologist'
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      console.log('Login realizado com sucesso:', user.email);
      alert('Login realizado com sucesso!');
      // Redirecionar para a página principal após login
      navigate('/home');
    } catch (error) {
      console.error('Erro no login:', error);
      let errorMessage = 'Erro ao fazer login.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Login com Google realizado com sucesso:', user.email);
      alert('Login com Google realizado com sucesso!');
      // Redirecionar para a página principal após login
      navigate('/home');
    } catch (error) {
      console.error('Erro no login com Google:', error);
      let errorMessage = 'Erro ao fazer login com Google.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login cancelado pelo usuário.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqueado pelo navegador. Permita popups para este site.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Muitas tentativas de login. Aguarde um momento.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'Uma conta já existe com este email usando outro método de login.';
          break;
        default:
          errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!formData.email) {
      alert('Digite seu e-mail para receber o link de redefinição.');
      return;
    }
    
    try {
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(auth, formData.email);
      alert('Email de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      let errorMessage = 'Erro ao enviar email de redefinição.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado com este email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = error.message;
      }
      
      alert(errorMessage);
    }
  };

  const navigate = useNavigate();

  // Light rays component simulation
  const LightRays = () => (
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
  );

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-white">
      <LightRays />

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

      {/* Login Container */}
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

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md hover:scale-110 hover:rotate-12 transition-all duration-500 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group cursor-pointer overflow-hidden">
              <img 
                src="/Logo-Sereno3.png" 
                alt="Sereno Logo" 
                className="w-8 h-8 object-contain group-hover:brightness-110 transition-all duration-300"
              />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-1 hover:text-white/90 transition-colors duration-300">Sereno</h1>
          <p className="text-white/60 text-sm hover:text-white/80 transition-colors duration-300">Sua Rede de Apoio em Saúde Mental</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)] group">
          <div className="mb-4">
            <h2 className="text-xl font-light text-white mb-1 group-hover:text-white/95 transition-colors duration-300">Acesse sua jornada</h2>
            <p className="text-white/60 text-sm group-hover:text-white/70 transition-colors duration-300">Faça login para continuar sua evolução pessoal</p>
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
                onClick={() => setUserType('user')}
                className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-md transition-all duration-300 text-sm group ${
                  userType === 'user' 
                    ? 'bg-white text-black shadow-lg scale-105 shadow-white/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <User className={`w-3 h-3 mr-1.5 transition-all duration-300 ${userType === 'user' ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                Usuário
              </button>
              <button
                type="button"
                onClick={() => setUserType('psychologist')}
                className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-md transition-all duration-300 text-sm group ${
                  userType === 'psychologist' 
                    ? 'bg-white text-black shadow-lg scale-105 shadow-white/20' 
                    : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <Brain className={`w-3 h-3 mr-1.5 transition-all duration-300 ${userType === 'psychologist' ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                Profissional
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1 group">
              <label htmlFor="email" className="block text-xs font-light text-white/80 group-hover:text-white/90 transition-colors duration-300">
                E-mail
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 transition-all duration-300 ${
                  focusedField === 'email' ? 'text-white/80 scale-110' : 'group-hover:text-white/70'
                }`} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-9 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 text-sm hover:bg-black/60 hover:border-white/30 ${
                    focusedField === 'email' ? 'scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''
                  }`}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1 group">
              <label htmlFor="password" className="block text-xs font-light text-white/80 group-hover:text-white/90 transition-colors duration-300">
                Senha
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 transition-all duration-300 ${
                  focusedField === 'password' ? 'text-white/80 scale-110' : 'group-hover:text-white/70'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full pl-9 pr-10 py-2.5 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 text-sm hover:bg-black/60 hover:border-white/30 ${
                    focusedField === 'password' ? 'scale-[1.02] shadow-[0_0_15px_rgba(255,255,255,0.1)]' : ''
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  {showPassword ? 
                    <EyeOff className="w-4 h-4 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" /> : 
                    <Eye className="w-4 h-4 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  }
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3 h-3 rounded border-white/30 bg-black/40 text-white focus:ring-white/30 focus:ring-2 transition-all duration-300 hover:scale-110"
                />
                <span className="ml-2 text-xs text-white/70 group-hover:text-white/90 transition-colors duration-300">Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-white/80 hover:text-white transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
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
                  Entrando...
                </div>
              ) : (
                <span className="relative z-10">Entrar</span>
              )}
            </button>
          </form>

          {/* Social Login - Only show for regular users */}
          {userType === 'user' && (
            <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-black text-white/60">ou continue com</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2">
                <button 
                  onClick={handleGoogle} 
                  type="button" 
                  className="flex items-center justify-center py-1.5 px-4 border border-white/20 rounded-lg text-white/80 hover:text-white hover:border-white/30 transition-all duration-300 text-sm hover:scale-[1.02] hover:bg-white/5 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)] group relative overflow-hidden"
                  onMouseEnter={() => setHoveredButton('google')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {/* Background glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 transition-opacity duration-300 ${
                    hoveredButton === 'google' ? 'opacity-100' : ''
                  }`}></div>
                  
                  <svg className="w-4 h-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.37c-.23 1.22-.93 2.25-1.98 2.94v2.45h3.2c1.87-1.72 2.97-4.25 2.97-7.4z" fill="#4285F4"/>
                    <path d="M12 23c2.7 0 4.96-.9 6.62-2.45l-3.2-2.45c-.9.6-2.06.96-3.42.96-2.63 0-4.85-1.77-5.64-4.15H3.01v2.6C4.65 20.98 8.06 23 12 23z" fill="#34A853"/>
                    <path d="M6.36 14.91c-.2-.6-.32-1.24-.32-1.91s.12-1.31.32-1.91V8.49H3.01A11 11 0 0 0 2 12c0 1.76.42 3.41 1.01 4.91l3.35-2z" fill="#FBBC05"/>
                    <path d="M12 5.27c1.47 0 2.8.51 3.84 1.5l2.88-2.88C16.94 2.23 14.7 1.32 12 1.32 8.06 1.32 4.65 3.34 3.01 6.09l3.35 2.6C7.15 7.31 9.37 5.27 12 5.27z" fill="#EA4335"/>
                  </svg>
                  <span className="relative z-10">Google</span>
                </button>
              </div>
            </div>
          )}

          {/* Psicólogo Info - Only show for psychologists */}
          {userType === 'psychologist' && (
            <div className="mt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/10 border border-white/20 rounded-lg p-3 text-center hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] group">
                <Brain className="w-5 h-5 text-white mx-auto mb-1.5 group-hover:scale-110 group-hover:animate-pulse transition-transform duration-300" />
                <p className="text-white text-xs font-medium group-hover:text-white transition-colors duration-300">Login Profissional</p>
                <p className="text-white/80 text-xs group-hover:text-white transition-colors duration-300">
                  Psicólogos devem usar suas credenciais registradas
                </p>
              </div>
            </div>
          )}

          {/* Sign up link */}
          <div className="mt-4 text-center">
            <p className="text-white/70 text-sm">
              Não tem uma conta?{' '}
              <button 
                onClick={() => navigate('/register')} 
                className="text-white hover:text-white/80 font-medium transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:scale-105 inline-block"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-white/50 text-xs animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="hover:text-white/70 transition-colors duration-300 cursor-default">
            Conecte-se, Entenda-se, <span className="text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-300">Evolua.</span>
          </p>
        </div>
      </div>


    </div>
  );
};

export default Login;