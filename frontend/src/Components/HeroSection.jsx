import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

const HeroSection = React.memo(({ scrollToSection }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Iniciar animação de digitação após um delay
    const typingTimer = setTimeout(() => {
      setIsTyping(true);
    }, 500);

    return () => clearTimeout(typingTimer);
  }, []);

  const handleExploreClick = useCallback(() => {
    scrollToSection('services');
  }, [scrollToSection]);

  // Login CTA removido

  // Dados memoizados para evitar recriações
  const features = useMemo(() => [
    { icon: Heart, text: "Comunidade Segura" },
    { icon: Sparkles, text: "Apoio Profissional" },
    { icon: Heart, text: "Crescimento Pessoal" }
  ], []);

  return (
    <section 
      className="relative mt-20 pb-12 min-h-screen flex items-center z-20 "
      aria-labelledby="hero-title"
      role="banner"
    >
      <div className="container-responsive relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Minimalista com animação melhorada */}
          <div className={`inline-flex items-center space-x-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-2.5 mb-6 md:mb-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <span className="text-white/80 text-xs md:text-sm font-light tracking-wider uppercase">
              Saúde Mental • Comunidade • Apoio
            </span>
          </div>

          {/* Título Principal com Animação de Digitação Melhorada */}
          <div className="mb-6 md:mb-8">
            <h1 
              id="hero-title"
              className="text-3xl md:text-5xl lg:text-6xl font-extralight mb-4 md:mb-5 leading-[0.9] md:leading-[0.85] tracking-tight"
            >
              <span className={`block text-white transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                Compartilhe,
              </span>
              <span className={`block text-white transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}>
                Entenda-se,{' '}
                <span 
                  className={`font-semibold transition-all duration-1000 delay-700 ${
                    isTyping ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Evolua.
                </span>
              </span>
            </h1>
          </div>

          {/* Subtítulo com Fade In Melhorado */}
          <p className={`text-base md:text-lg text-white/70 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light tracking-wide transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Conecte-se com uma comunidade acolhedora, compartilhe suas experiências sem julgamentos e tenha acesso a profissionais de saúde mental verificados.
          </p>

          {/* Features flutuantes */}
          <div className={`flex justify-center items-center space-x-6 mb-6 transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center space-x-2 text-white/60 text-xs md:text-sm"
                style={{ animationDelay: `${1200 + index * 200}ms` }}
              >
                <feature.icon className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA - Somente Explorar Recursos */}
          <div className={`flex justify-center items-center transition-all duration-1000 delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button 
              onClick={handleExploreClick}
              className="group relative bg-transparent border border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl transition-all duration-300 text-sm md:text-base font-light tracking-wide hover:bg-white/5 backdrop-blur-md focus-ring hover:scale-105"
              aria-label="Explorar recursos e funcionalidades da plataforma"
            >
              <span className="relative z-10 flex items-center justify-center space-x-2 md:space-x-3">
                <span>Explorar Recursos</span>
                <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 group-hover:scale-110" aria-hidden="true" />
              </span>
            </button>
          </div>

          {/* Indicador de scroll */}
          <div className={`mt-12 transition-all duration-1000 delay-1500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex flex-col items-center space-y-2 text-white/40 text-xs">
              <span>Role para descobrir mais</span>
              <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center">
                <div className="w-1 h-2.5 bg-white/40 rounded-full mt-1.5 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elementos decorativos flutuantes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-16 left-8 w-1.5 h-1.5 bg-white/20 rounded-full transition-all duration-2000 delay-500 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}></div>
        <div className={`absolute top-32 right-16 w-1 h-1 bg-white/30 rounded-full transition-all duration-2000 delay-700 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}></div>
        <div className={`absolute bottom-32 left-16 w-1.5 h-1.5 bg-white/25 rounded-full transition-all duration-2000 delay-900 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}></div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
