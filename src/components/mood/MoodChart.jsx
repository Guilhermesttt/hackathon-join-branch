import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMoodTracking } from '../../hooks/useFirestore';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const MoodChart = () => {
  const { user } = useAuth();
  const { moodHistory, loading, getMoodStats } = useMoodTracking(user?.uid);

  const weeklyData = useMemo(() => {
    if (!moodHistory || moodHistory.length === 0) {
      return Array(7).fill(null).map((_, index) => ({
        day: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][index],
        intensity: 0,
        energy: 0,
        stability: 0
      }));
    }

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const now = new Date();
    
    return days.map((day, index) => {
      const dayOfWeek = index;
      const dayMoods = moodHistory.filter(mood => {
        const moodDate = mood.recordedAt?.toDate ? mood.recordedAt.toDate() : new Date(mood.recordedAt);
        return moodDate.getDay() === dayOfWeek;
      });

      if (dayMoods.length === 0) {
        return { day, intensity: 0, energy: 0, stability: 0 };
      }

      const avgIntensity = dayMoods.reduce((sum, mood) => sum + (mood.intensity || 0), 0) / dayMoods.length;
      const avgEnergy = dayMoods.reduce((sum, mood) => sum + (mood.energy || 0), 0) / dayMoods.length;
      const avgStability = dayMoods.reduce((sum, mood) => sum + (mood.stability || 0), 0) / dayMoods.length;

      return {
        day,
        intensity: Math.round(avgIntensity),
        energy: Math.round(avgEnergy),
        stability: Math.round(avgStability)
      };
    });
  }, [moodHistory]);

  const stats = useMemo(() => getMoodStats(), [getMoodStats]);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-white/60" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving':
        return 'text-green-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-white/70">Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-5 h-5 text-white/80" />
        <h2 className="text-lg font-semibold text-white">Tendência Semanal</h2>
      </div>

      {/* Weekly Chart */}
      <div className="space-y-4 mb-6">
        <div className="flex items-end justify-between h-32 px-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1 group">
              <div className="relative w-full max-w-[20px] flex flex-col items-center space-y-1">
                {/* Stability Bar */}
                <div
                  className="w-full bg-gradient-to-t from-purple-500/70 to-purple-400/70 rounded-sm transition-all duration-300 hover:from-purple-500 hover:to-purple-400 group-hover:scale-110"
                  style={{
                    height: `${(day.stability / 10) * 80}px`,
                    minHeight: day.stability > 0 ? '4px' : '0px'
                  }}
                  title={`Estabilidade: ${day.stability}/10`}
                />
                
                {/* Energy Bar */}
                <div
                  className="w-full bg-gradient-to-t from-green-500/70 to-green-400/70 rounded-sm transition-all duration-300 hover:from-green-500 hover:to-green-400 group-hover:scale-110"
                  style={{
                    height: `${(day.energy / 10) * 80}px`,
                    minHeight: day.energy > 0 ? '4px' : '0px'
                  }}
                  title={`Energia: ${day.energy}/10`}
                />
                
                {/* Intensity Bar */}
                <div
                  className="w-full bg-gradient-to-t from-blue-500/70 to-blue-400/70 rounded-sm transition-all duration-300 hover:from-blue-500 hover:to-blue-400 group-hover:scale-110"
                  style={{
                    height: `${(day.intensity / 10) * 80}px`,
                    minHeight: day.intensity > 0 ? '4px' : '0px'
                  }}
                  title={`Intensidade: ${day.intensity}/10`}
                />
              </div>
              
              <span className="text-xs text-white/60 font-medium mt-2 group-hover:text-white transition-colors">
                {day.day}
              </span>
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center space-x-6 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-sm" />
            <span className="text-xs text-white/60">Intensidade</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-400 rounded-sm" />
            <span className="text-xs text-white/60">Energia</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-sm" />
            <span className="text-xs text-white/60">Estabilidade</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.averageIntensity}
          </div>
          <div className="text-xs text-white/60">Intensidade Média</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.averageEnergy}
          </div>
          <div className="text-xs text-white/60">Energia Média</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {stats.averageStability}
          </div>
          <div className="text-xs text-white/60">Estabilidade Média</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {getTrendIcon(stats.weeklyTrend)}
            <span className={`text-sm font-medium ${getTrendColor(stats.weeklyTrend)}`}>
              {stats.weeklyTrend === 'improving' ? 'Melhorando' : 
               stats.weeklyTrend === 'declining' ? 'Declinando' : 'Estável'}
            </span>
          </div>
          <div className="text-xs text-white/60">Tendência</div>
        </div>
      </div>
    </div>
  );
};

export default MoodChart;