import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, User, Sparkles } from 'lucide-react';
import LightRays from './Components/LightRays';
import { useAuth } from './contexts/AuthContext';

const Connected = () => {
  const navigate = useNavigate();
  const { markProfileAsComplete } = useAuth();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    // Marcar o perfil como completo imediatamente
    const markProfile = async () => {
      try {
        await markProfileAsComplete();
        console.log('Perfil marcado como completo com sucesso');
      } catch (error) {
        console.error('Erro ao marcar perfil como completo:', error);
      }
    };
    
    markProfile();

    // Redirecionar após 2 segundos
    const timer = setTimeout(() => {
      console.log('Redirecionando para /home...');
      navigate('/home');
    }, 2000);

    // Contador regressivo
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [navigate, markProfileAsComplete]);

  // Função de teste para redirecionamento manual
  const handleManualRedirect = () => {
    console.log('Redirecionamento manual para /home...');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-white">
      <LightRays />
      
      <div className="relative w-full max-w-lg z-10 text-center">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Ícone de sucesso */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-3xl font-light mb-3 text-white">
            Perfil Completo!
          </h1>
          
          {/* Mensagem de sucesso */}
          <p className="text-white/70 text-lg mb-6">
            Seu perfil foi criado com sucesso. Bem-vindo ao Sereno!
          </p>

          {/* Informações adicionais */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <User className="w-4 h-4" />
              <span>Perfil personalizado configurado</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white/60">
              <Sparkles className="w-4 h-4" />
              <span>Pronto para explorar a plataforma</span>
            </div>
          </div>

          {/* Contador regressivo */}
          <div className="text-center mb-6">
            <p className="text-white/50 text-sm mb-2">Redirecionando automaticamente em:</p>
            <div className="text-2xl font-bold text-green-400">
              {countdown} segundos
            </div>
          </div>

          {/* Botão de teste para redirecionamento manual */}
          <button
            onClick={handleManualRedirect}
            className="w-full py-3 px-6 bg-white/10 border border-white/20 text-white hover:bg-white/20 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            Ir para Home Agora (Teste)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connected;


