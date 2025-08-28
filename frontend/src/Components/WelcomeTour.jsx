import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Home, 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Bell, 
  Settings,
  Users,
  Calendar
} from 'lucide-react';

const WelcomeTour = ({ isOpen, onClose, userRole = 'cliente', isFirstTime = false }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isClosing, setIsClosing] = useState(false);

  const steps = [
    {
      id: 'welcome',
      title: 'Bem-vindo ao Sereno! 🎉',
      description: 'Vamos te ajudar a conhecer as principais funcionalidades do aplicativo para sua saúde mental.',
      icon: Home,
      position: 'center'
    },
    {
      id: 'home',
      title: 'Página Inicial',
      description: 'Aqui você encontra posts da comunidade, grupos sugeridos e um resumo do seu humor diário.',
      icon: Home,
      position: 'center'
    },
    {
      id: 'chat',
      title: 'Chat e Suporte',
      description: 'Conecte-se com psicólogos ou converse com outros usuários da comunidade para apoio emocional.',
      icon: MessageCircle,
      position: 'center'
    },
    {
      id: 'diary',
              title: 'Diário Evolutivo',
      description: 'Registre seus pensamentos, sentimentos e reflexões diárias com prompts guiados.',
      icon: BookOpen,
      position: 'center'
    },
    {
      id: 'humor',
      title: 'Rastreador de Humor',
      description: 'Monitore seu humor diário, visualize tendências e receba insights sobre seu bem-estar emocional.',
      icon: BarChart3,
      position: 'center'
    },
    {
      id: 'sessions',
      title: userRole === 'psicologo' ? 'Gerenciar Sessões' : 'Agendar Sessões',
      description: userRole === 'psicologo' 
        ? 'Gerencie sua agenda, visualize sessões agendadas e configure sua disponibilidade.'
        : 'Encontre psicólogos disponíveis e agende sessões de terapia online ou presencial.',
      icon: Calendar,
      position: 'center'
    },
    {
      id: 'notifications',
      title: 'Notificações',
      description: 'Mantenha-se atualizado com mensagens, lembretes de sessões e atividades da comunidade.',
      icon: Bell,
      position: 'center'
    },
    {
      id: 'settings',
      title: 'Configurações',
      description: 'Personalize seu perfil, gerencie notificações e configure suas preferências de privacidade.',
      icon: Settings,
      position: 'center'
    },
    {
      id: 'community',
      title: 'Comunidade',
      description: 'Participe de grupos de apoio, compartilhe experiências e conecte-se com pessoas que passam por situações similares.',
      icon: Users,
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setCompletedSteps(new Set());
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, steps[currentStep].id]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, steps[currentStep].id]));
    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    
    // Fechar o tour
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const isStepCompleted = (stepId) => completedSteps.has(stepId);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      {/* Background com animação baseada na primeira vez */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-800 ${
          isFirstTime 
            ? 'bg-black' 
            : 'bg-black/80 backdrop-blur-sm'
        } ${isClosing ? 'background-fade-out' : 'background-fade-in'}`}
      />
      
      {/* Modal principal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className={`bg-black/95 border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto ${
            isClosing ? 'tour-modal-out' : 'tour-modal-in'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm text-white/60 mb-2">
              <span className="font-medium">Passo {currentStep + 1} de {steps.length}</span>
              <div className="flex items-center space-x-6">
                <span className="font-medium">{Math.round(progress)}%</span>
                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full hover:scale-110 transition-transform duration-200"
                  title="Fechar tour"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <IconComponent className="w-10 h-10 text-black" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">
              {currentStepData.title}
            </h2>
            
            <p className="text-white/80 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-white scale-125'
                    : isStepCompleted(step.id)
                    ? 'bg-white'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              Pular tour
            </button>

            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              )}

              {isLastStep ? (
                <button
                  onClick={handleComplete}
                  className="flex items-center space-x-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <Check className="w-4 h-4" />
                  <span>Começar a usar</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300"
                >
                  <span>Próximo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>


        </div>
      </div>
    </>
  );
};

export default WelcomeTour;
