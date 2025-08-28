import React, { useState } from 'react';
import { Calendar, Save, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMoodTracking } from '../../hooks/useFirestore';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const MoodRecorder = ({ onMoodRecorded }) => {
  const { user } = useAuth();
  const { recordMood } = useMoodTracking(user?.uid);
  
  const [intensity, setIntensity] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [stability, setStability] = useState(5);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const moodTags = [
    'ansiedade', 'felicidade', 'tristeza', 'estresse', 'calma',
    'energia', 'cansaço', 'motivação', 'frustração', 'gratidão',
    'trabalho', 'família', 'relacionamentos', 'saúde', 'sono'
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Você precisa estar logado para registrar seu humor.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const moodData = {
        intensity: parseInt(intensity),
        energy: parseInt(energy),
        stability: parseInt(stability),
        notes: notes.trim(),
        tags: selectedTags,
        date: new Date().toISOString().split('T')[0]
      };

      const moodId = await recordMood(moodData);
      
      if (moodId) {
        // Reset form
        setIntensity(5);
        setEnergy(5);
        setStability(5);
        setNotes('');
        setSelectedTags([]);
        
        onMoodRecorded?.(moodData);
      }
    } catch (err) {
      setError('Erro ao registrar humor. Tente novamente.');
      console.error('Error recording mood:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CustomSlider = ({ value, onChange, label, color = 'white' }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/80">
        {label}: {value}/10
      </label>
      
      <div className="relative h-2 bg-white/10 rounded-full">
        <div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r from-${color}/60 to-${color}/80 rounded-full transition-all duration-300`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
        
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      
      <div className="flex justify-between text-xs text-white/40">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-white/80" />
        <h2 className="text-lg font-semibold text-white">Check-in Diário</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mood Sliders */}
        <div className="space-y-4">
          <CustomSlider 
            value={intensity} 
            onChange={setIntensity} 
            label="Intensidade Emocional"
            color="blue"
          />
          
          <CustomSlider 
            value={energy} 
            onChange={setEnergy} 
            label="Nível de Energia"
            color="green"
          />
          
          <CustomSlider 
            value={stability} 
            onChange={setStability} 
            label="Estabilidade Mental"
            color="purple"
          />
        </div>

        {/* Tags Selection */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            Como você se sente? (selecione até 5 tags)
          </label>
          
          <div className="flex flex-wrap gap-2">
            {moodTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                disabled={!selectedTags.includes(tag) && selectedTags.length >= 5}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                    : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20 hover:text-white disabled:opacity-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          <p className="text-xs text-white/50 mt-2">
            {selectedTags.length}/5 tags selecionadas
          </p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Como foi seu dia? O que influenciou seu humor?"
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
            rows={3}
            maxLength={500}
            disabled={isSubmitting}
          />
          <p className="text-xs text-white/50 mt-1">
            {notes.length}/500 caracteres
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || !user}
          loading={isSubmitting}
          className="w-full"
          leftIcon={Save}
        >
          {isSubmitting ? 'Salvando Check-in...' : 'Salvar Check-in'}
        </Button>
      </form>
    </div>
  );
};

export default MoodRecorder;