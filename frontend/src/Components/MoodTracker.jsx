import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, CheckCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { moodService } from '../services/firebaseService';

const MoodTracker = ({ onOpenHumorTab }) => {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Seg', mood: 0, energy: 0 },
    { day: 'Ter', mood: 0, energy: 0 },
    { day: 'Qua', mood: 0, energy: 0 },
    { day: 'Qui', mood: 0, energy: 0 },
    { day: 'Sex', mood: 0, energy: 0 },
    { day: 'Sáb', mood: 0, energy: 0 },
    { day: 'Dom', mood: 0, energy: 0 }
  ]);
  const [intensity, setIntensity] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stability, setStability] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  const maxValue = 10;

  const trendsRef = useRef(null);
  const [highlightTrends, setHighlightTrends] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const history = await moodService.getUserMoodHistory(user.uid, 7);
      const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
      const now = new Date();
      const mapped = [0,0,0,0,0,0,0].map((_, idx) => {
        const d = (idx + 1) % 7; // Seg a Dom
        const label = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'][idx];
        const moods = history.filter(h => {
          const dt = h.recordedAt?.toDate ? h.recordedAt.toDate() : new Date(h.recordedAt);
          return dt && dt.getDay() === (idx+1)%7;
        });
        const avgMood = moods.length ? Math.round(moods.reduce((s, m) => s + (m.intensity||0), 0) / moods.length) : 0;
        const avgEnergy = moods.length ? Math.round(moods.reduce((s, m) => s + (m.energy||0), 0) / moods.length) : 0;
        return { day: label, mood: avgMood, energy: avgEnergy };
      });
      setWeeklyData(mapped);
    };
    load();
  }, [user]);

  const handleSaveCheckin = async () => {
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    // Validação dos dados
    if (intensity < 0 || intensity > 10 || energy < 0 || energy > 10 || stability < 0 || stability > 10) {
      alert('Por favor, verifique se todos os valores estão entre 0 e 10');
      return;
    }

    setIsSaving(true);
    
    try {
      const moodData = {
        intensity: parseInt(intensity),
        energy: parseInt(energy),
        stability: parseInt(stability),
        notes: 'Check-in diário',
        tags: ['daily', 'checkin'],
        date: new Date().toISOString().split('T')[0], // Data atual
        timestamp: new Date().toISOString()
      };

      console.log('Salvando check-in no Firebase:', moodData);
      
      const result = await moodService.recordMood(user.uid, moodData);
      
      if (result && result.success) {
        console.log('Check-in salvo com sucesso:', result.moodId);
        
        // Mostrar feedback visual
        setLastSaved(new Date());
        
        // Atualizar histórico após salvar
        try {
          const history = await moodService.getUserMoodHistory(user.uid, 7);
          const mapped = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((label, idx) => {
            const moods = history.filter(h => {
              const dt = h.recordedAt?.toDate ? h.recordedAt.toDate() : new Date(h.recordedAt);
              return dt && dt.getDay() === (idx+1)%7;
            });
            const avgMood = moods.length ? Math.round(moods.reduce((s, m) => s + (m.intensity||0), 0) / moods.length) : 0;
            const avgEnergy = moods.length ? Math.round(moods.reduce((s, m) => s + (m.energy||0), 0) / moods.length) : 0;
            return { day: label, mood: avgMood, energy: avgEnergy };
          });
          setWeeklyData(mapped);
        } catch (historyError) {
          console.warn('Erro ao atualizar histórico, mas check-in foi salvo:', historyError);
        }
        
        // Reset dos valores após salvar
        setTimeout(() => {
          setIntensity(5);
          setEnergy(5);
          setStability(5);
        }, 1000);
        
      } else {
        throw new Error('Falha ao salvar check-in no Firebase');
      }
      
    } catch (error) {
      console.error('Erro ao salvar check-in:', error);
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao salvar check-in. Tente novamente.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Erro de permissão. Verifique se você está logado.';
      } else if (error.code === 'unavailable') {
        errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
      } else if (error.code === 'network-error') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Componente de slider customizado
  const CustomSlider = ({ value, onChange, label }) => (
    <div className="space-y-2 group/slider">
      <label className="text-sm font-medium text-white/80 group-hover/slider:text-white transition-colors duration-300">
        {label}: {value}/10
      </label>
      
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden group-hover/slider:bg-white/20 transition-all duration-300">
        {/* Track de fundo */}
        <div className="absolute inset-0 bg-white/5 rounded-full"></div>
        
        {/* Barra preenchida */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/60 to-white/80 rounded-full transition-all duration-300 group-hover/slider:from-white/80 group-hover/slider:to-white shadow-lg group-hover/slider:shadow-white/25"
          style={{ width: `${(value / maxValue) * 100}%` }}
        ></div>
        
        {/* Thumb do slider */}
        <div 
          className="absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl group-hover/slider:scale-110 group-hover/slider:shadow-2xl group-hover/slider:shadow-white/40 ring-2 ring-white/20 group-hover/slider:ring-white/40"
          style={{ left: `${(value / maxValue) * 100}%`, marginLeft: '-10px' }}
          onMouseDown={(e) => {
            const handleMouseMove = (moveEvent) => {
              const rect = e.currentTarget.parentElement.getBoundingClientRect();
              const newValue = Math.max(0, Math.min(maxValue, 
                Math.round(((moveEvent.clientX - rect.left) / rect.width) * maxValue)
              ));
              onChange(newValue);
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
        
        {/* Input range invisível para acessibilidade */}
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      
      {/* Marcadores de valor */}
      <div className="flex justify-between text-xs text-white/40 group-hover/slider:text-white/60 transition-colors duration-300">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animation-initial animate-fade-in-right animation-delay-200">
      {/* Daily Check-in */}
      <div className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:border-white/30 relative overflow-hidden">
        {/* Animated background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
        
        <div className="flex items-center space-x-2 mb-6 relative z-10">
          <div className="relative">
            <Calendar className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:scale-110" />
            <div className="absolute -inset-2 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h2 className="text-lg font-semibold text-white group-hover:text-white/90 transition-all duration-300 group-hover:tracking-wide">Check-in Diário</h2>
          {lastSaved && (
            <div className="flex items-center space-x-2 ml-auto text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Salvo às {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-6 relative z-10">
          {/* Mood Metrics com sliders customizados */}
          <CustomSlider 
            value={intensity} 
            onChange={setIntensity} 
            label="Intensidade" 
          />
          
          <CustomSlider 
            value={energy} 
            onChange={setEnergy} 
            label="Energia" 
          />
          
          <CustomSlider 
            value={stability} 
            onChange={setStability} 
            label="Estabilidade" 
          />
          
          {/* Botão de salvar com feedback visual */}
          <button 
            onClick={handleSaveCheckin} 
            disabled={isSaving}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 transform ${
              isSaving 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed scale-100' 
                : lastSaved
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 hover:shadow-xl hover:shadow-green-500/25'
                  : 'bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-gray-300 hover:scale-105 hover:shadow-xl hover:shadow-white/25'
            } shadow-lg`}
          >
            {isSaving ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Salvando...</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Check-in Salvo!</span>
              </div>
            ) : (
              'Salvar Check-in'
            )}
          </button>
        </div>
        
        {/* Bottom border glow */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Weekly Trends */}
      <div ref={trendsRef} className={`group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:from-white/10 hover:to-white/15 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:border-white/30 relative overflow-hidden ${highlightTrends ? 'ring-2 ring-white/50' : ''}`}>
        {/* Animated background glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
        
        <div className="flex items-center space-x-2 mb-12 relative z-10">
          <div className="relative">
            <TrendingUp className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300 group-hover:scale-110" />
            <div className="absolute -inset-2 bg-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-150"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <h2 className="text-lg font-semibold text-white group-hover:text-white/90 transition-all duration-300 group-hover:tracking-wide">Tendência Semanal</h2>
        </div>
        
        {/* Simple Bar Chart */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-end justify-between h-32 px-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center flex-1 group/day">
                <div className="relative w-full max-w-[20px] flex flex-col items-center space-y-1">
                  {/* Energy Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-gray-400/70 to-gray-300/70 rounded-sm transition-all duration-500 hover:from-gray-400 hover:to-gray-300 group-hover/day:scale-110 group-hover/day:shadow-lg group-hover/day:shadow-gray-400/25 relative overflow-hidden"
                    style={{
                      height: `${(day.energy / maxValue) * 80}px`,
                      minHeight: '8px'
                    }}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/day:opacity-100 transition-opacity duration-500 group-hover/day:animate-pulse"></div>
                  </div>
                  {/* Mood Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-white/70 to-gray-200/70 rounded-sm transition-all duration-500 hover:from-white hover:to-gray-200 group-hover/day:scale-110 group-hover/day:shadow-lg group-hover/day:shadow-white/25 relative overflow-hidden"
                    style={{
                      height: `${(day.mood / maxValue) * 80}px`,
                      minHeight: '8px'
                    }}
                  >
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover/day:opacity-100 transition-opacity duration-500 group-hover/day:animate-pulse"></div>
                  </div>
                </div>
                <span className="text-xs text-white/60 font-medium group-hover/day:text-white transition-colors duration-300 group-hover/day:scale-110 group-hover/day:font-semibold">{day.day}</span>
                
                {/* Floating particles effect */}
                <div className="absolute top-2 right-2 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover/day:opacity-100 group-hover/day:animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute top-4 right-6 w-0.5 h-0.5 bg-white/20 rounded-full opacity-0 group-hover/day:opacity-100 group-hover/day:animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-700/30">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-white to-gray-200 rounded-sm"></div>
              <span className="text-xs text-gray-400">Humor</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-sm"></div>
              <span className="text-xs text-gray-400">Energia</span>
            </div>
          </div>
        </div>

        {/* Agendar Sessão Button */}
        <div className="mt-6 pt-4 border-t border-gray-700/30 relative z-10">
          <button
            onClick={() => onOpenHumorTab('scheduling')}
            className="w-full bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/25 flex items-center justify-center space-x-2 text-sm transform"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Agendar Sessão</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;