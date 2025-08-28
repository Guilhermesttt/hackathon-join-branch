import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGreeting } from '../hooks/useGreeting';
import Card from './ui/Card';

const WelcomeScreen = React.memo(({ showWelcomeMessage = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showGreeting, setShowGreeting] = useState(true); // Sempre mostrar por padrão
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { text: greetingText, icon: GreetingIcon, formattedDate } = useGreeting(user?.username || user?.displayName);

  // Controla a exibição do texto de boas-vindas
  useEffect(() => {
    if (showWelcomeMessage) {
      // Para usuários de primeira vez, reinicia a exibição
      setShowGreeting(true);
      
      // Esconde o texto após 1.5 segundos
      const timer = setTimeout(() => {
        setShowGreeting(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [showWelcomeMessage]);

  // Estado para controlar a animação de fade-out
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Controla a animação de fade-out apenas quando showWelcomeMessage for true
  useEffect(() => {
    if (showWelcomeMessage && showGreeting) {
      // Inicia o fade-out após 1 segundo (deixa 0.5s para a animação)
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1000);
      
      return () => clearTimeout(fadeTimer);
    } else {
      setIsFadingOut(false);
    }
  }, [showWelcomeMessage, showGreeting]);

  const [motivationalPhrase, setMotivationalPhrase] = useState(null);
  const [loadingPhrase, setLoadingPhrase] = useState(false);

  // Frases motivacionais locais em vez de API externa
  const motivationalPhrases = useMemo(() => [
    {
      frase: "A jornada de mil milhas começa com um único passo.",
      autor: "Lao Tzu"
    },
    {
      frase: "A felicidade não é algo pronto. Ela vem das suas próprias ações.",
      autor: "Dalai Lama"
    },
    {
      frase: "Cada dia é uma nova oportunidade para ser melhor.",
      autor: "Desconhecido"
    },
    {
      frase: "A mente é como um paraquedas. Só funciona quando está aberta.",
      autor: "Frank Zappa"
    },
    {
      frase: "O bem-estar começa com a aceitação de quem você é.",
      autor: "Desconhecido"
    }
  ], []);

  const fetchPhrase = useCallback(async () => {
    setLoadingPhrase(true);
    try {
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Selecionar frase aleatória
      const randomIndex = Math.floor(Math.random() * motivationalPhrases.length);
      setMotivationalPhrase(motivationalPhrases[randomIndex]);
    } catch (_) {
      setMotivationalPhrase(null);
    } finally {
      setLoadingPhrase(false);
    }
  }, [motivationalPhrases]);

  useEffect(() => {
    fetchPhrase();
  }, [fetchPhrase]);

  const psychologists = useMemo(() => [
    {
      name: "Dr. Alberto Mendes",
      specialty: "Especialista em Terapia Cognitivo-Comportamental",
      experience: "15 anos",
      initials: "DR."
    },
    {
      name: "Dra. Clara Ribeiro", 
      specialty: "Especialista em Psicologia Analítica",
      experience: "10 anos",
      initials: "DRA."
    }
  ], []);

  const refreshPhrase = useCallback(() => {
    fetchPhrase();
  }, [fetchPhrase]);

  const handlePsychologistClick = useCallback((name) => {
    const slug = encodeURIComponent(name).toLowerCase().replace(/%20/g, '-');
    navigate(`/user/${slug}`);
  }, [navigate]);

  const handleKeyDown = useCallback(() => {}, []);

  return (
    <Card variant="glass" padding="lg" className="mb-8 animation-initial animate-fade-in-up">
      {/* Greeting */}
      {showGreeting && (
        <Card.Header>
          <div className={`text-center mb-6 animation-initial animate-fade-in-up animation-delay-100 ${
            showWelcomeMessage && isFadingOut ? 'welcome-greeting-fade-out' : ''
          }`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <GreetingIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
              <h2 className="text-2xl font-bold text-white">{greetingText}</h2>
            </div>
            <time className="text-gray-400" dateTime={new Date().toISOString()}>
              {formattedDate}
            </time>
          </div>
        </Card.Header>
      )}

      <Card.Content>
        {/* Motivational from Backend */}
        <Card variant="glass" padding="lg" className="mb-6 animation-initial animate-fade-in-up animation-delay-200">
          <div 
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Mensagem motivacional"
            aria-live="polite"
          >
            {/* removed decorative circle above the phrase to keep UI clean */}
            
            {/* Motivational Card */}
            <div className="text-center min-h-[100px] flex flex-col justify-center">
              {loadingPhrase ? (
                <div className="text-white/70">Carregando frase...</div>
              ) : motivationalPhrase ? (
                <>
                  <blockquote className="text-white text-lg leading-relaxed mb-3">
                    "{motivationalPhrase.frase}"
                  </blockquote>
                  <cite className="text-gray-300 text-sm font-medium not-italic">
                    - {motivationalPhrase.autor}
                  </cite>
                </>
              ) : (
                <div className="text-white/70">Não foi possível carregar a frase agora.</div>
              )}
            </div>

            <div className="flex items-center justify-center mt-6">
              <button
                onClick={refreshPhrase}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors focus-ring"
                aria-label="Atualizar frase"
              >
                Nova frase
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-300">
                Ajudando na construção da sua própria história!
              </p>
              <div className="flex justify-center space-x-1 mt-2" role="img" aria-label="Corações de apoio">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} className="w-4 h-4 text-gray-400 fill-current" aria-hidden="true" />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Psychologist Recommendations */}
        <Card variant="glass" padding="lg">
          <Card.Header>
            <h2 className="text-xl font-semibold text-white mb-6">
              Psicólogos Recomendados
            </h2>
          </Card.Header>
          
          <Card.Content>
            <div className="space-y-4">
              {psychologists.map((psychologist) => (
                <article key={psychologist.name} className="card-user">
                  <div className="avatar-large">
                    <span className="text-xl font-bold text-white">{psychologist.initials}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{psychologist.name}</h3>
                    <p className="text-gray-300 text-sm">{psychologist.specialty}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Experiência: {psychologist.experience}
                    </p>
                  </div>
                  <button 
                    onClick={() => handlePsychologistClick(psychologist.name)}
                    className="btn-primary focus-ring"
                    aria-label={`Ver perfil de ${psychologist.name}`}
                  >
                    Ver Perfil
                  </button>
                </article>
              ))}
            </div>
          </Card.Content>
        </Card>
      </Card.Content>
    </Card>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

export default WelcomeScreen;