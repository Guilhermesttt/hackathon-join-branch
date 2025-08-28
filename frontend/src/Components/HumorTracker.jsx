import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter,
  Search,
  Clock,
  Activity,
  Target,
  Award,
  MessageCircle,
  Users
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';


const HumorTracker = ({ defaultTab = 'track' }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedCause, setSelectedCause] = useState('');
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [userData, setUserData] = useState(null);
  const [moodEntries, setMoodEntries] = useState([]);
  const [showMoodForm, setShowMoodForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('week');

  // Estados para agendamento
  const [showScheduling, setShowScheduling] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState('individual');
  const [sessionNotes, setSessionNotes] = useState('');

  const moods = [
    { emoji: '😊', label: 'Feliz', value: 'happy' },
    { emoji: '😔', label: 'Triste', value: 'sad' },
    { emoji: '😡', label: 'Raiva', value: 'angry' },
    { emoji: '😰', label: 'Medo', value: 'fear' },
    { emoji: '😌', label: 'Paz', value: 'peace' },
    { emoji: '❤️', label: 'Amor', value: 'love' }
  ];

  const causes = [
    'Sono', 'Eu Mesmo(a)', 'Família',
    'Saúde', 'Amizades', 'Estudos',
    'Lazer', 'Trabalho', 'Relação',
    'Luto', 'Finanças', 'Outras'
  ];

  // Dados para agendamento
  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const sessionTypes = [
    { id: 'individual', label: 'Sessão Individual', description: 'Acompanhamento personalizado' },
    { id: 'couple', label: 'Terapia de Casal', description: 'Para relacionamentos' },
    { id: 'family', label: 'Terapia Familiar', description: 'Para toda a família' },
    { id: 'group', label: 'Grupo Terapêutico', description: 'Compartilhando experiências' }
  ];

  // Arrays vazios para dados reais
  const mockMoodEntries = [];
  const monthlyStats = [];
  const calendarDays = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    mood: null,
    intensity: null
  }));

  const handleMoodSubmit = () => {
    if (!selectedMood || !selectedCause) return;
    
    // TODO: Implementar envio de humor para Firebase
    console.log('Humor enviado:', { selectedMood, selectedCause });
    
    setShowMoodForm(false);
    setSelectedMood('');
    setSelectedCause('');
  };

  const handleScheduleSession = () => {
    if (!selectedDate || !selectedTime || !sessionType) return;
    
    // TODO: Implementar agendamento no Firebase
    console.log('Agendando sessão:', {
      date: selectedDate,
      time: selectedTime,
      type: sessionType,
      notes: sessionNotes
    });
    
    // Limpar formulário e fechar
    setSelectedDate('');
    setSelectedTime('');
    setSessionType('individual');
    setSessionNotes('');
    setShowScheduling(false);
    
    alert('Sessão agendada com sucesso! Em breve entraremos em contato para confirmar.');
  };

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dayNumber: date.getDate()
      });
    }
    
    return dates;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
    setMoodEntries(mockMoodEntries);
  }, []);

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'bg-green-500';
      case 'sad': return 'bg-blue-500';
      case 'angry': return 'bg-red-500';
      case 'fear': return 'bg-yellow-500';
      case 'peace': return 'bg-purple-500';
      case 'love': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'sad': return '😔';
      case 'angry': return '😡';
      case 'fear': return '😰';
      case 'peace': return '😌';
      case 'love': return '❤️';
      default: return '😐';
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 animation-initial animate-fade-in-up animation-delay-100">
      {/* Header with Tabs */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Rastreador de Humor</h2>
          </div>
          <button
            onClick={() => setShowMoodForm(!showMoodForm)}
            className="bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Registrar Humor
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'track'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Rastreamento
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Histórico
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Análises
          </button>
          <button
            onClick={() => setActiveTab('scheduling')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'scheduling'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Agendar Sessão
          </button>
        </div>
      </div>

      {/* Mood Registration Form */}
      {showMoodForm && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Registrar Humor</h3>
            <button
              onClick={() => setShowMoodForm(false)}
              className="text-white/50 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <p className="text-sm text-gray-300 mb-3">Escolha uma Opção:</p>
              <div className="grid grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex flex-col items-center space-y-2 p-3 rounded-xl transition-all duration-200 ${
                      selectedMood === mood.value
                        ? 'bg-white/10 border border-white/20 scale-105'
                        : 'bg-gray-800/30 hover:bg-gray-700/30 hover:scale-105'
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs text-gray-300">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cause Selection */}
            <div>
              <p className="text-sm text-gray-300 mb-3">Principal Causa:</p>
              <div className="grid grid-cols-3 gap-2">
                {causes.map((cause) => (
                  <button
                    key={cause}
                    onClick={() => setSelectedCause(cause)}
                    className={`p-2 rounded-lg text-xs transition-all duration-200 ${
                      selectedCause === cause
                        ? 'bg-white/10 border border-white/20 text-white'
                        : 'bg-gray-800/30 hover:bg-gray-700/30 text-gray-300'
                    }`}
                  >
                    {cause}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleMoodSubmit}
              disabled={!selectedMood || !selectedCause}
              className="w-full bg-gradient-to-r from-white to-gray-200 text-black py-3 px-4 rounded-xl font-medium hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              REGISTRAR
            </button>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'track' && (
        <>
          {/* Calendar View */}
          <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Janeiro de 2024</h3>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">‹</button>
                <button className="p-1 text-gray-400 hover:text-white">›</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, index) => (
                <div key={`${day}-${index}`} className="text-center text-xs text-gray-400 p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => (
                <button
                  key={day.day}
                  className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg transition-all duration-200 ${
                    day.mood
                      ? `${getMoodColor(day.mood)} text-white`
                      : 'text-gray-300 hover:bg-gray-700/30'
                  }`}
                >
                  <span className="text-xs">{day.day}</span>
                  {day.mood && (
                    <span className="text-xs opacity-75">{day.intensity}/10</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo da Semana</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">😊</div>
                <div className="text-white font-medium">Humor Médio</div>
                <div className="text-white/70 text-sm">0/10</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-white font-medium">Entradas</div>
                <div className="text-white/70 text-sm">0 esta semana</div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Histórico de Humor</h3>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar entradas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                />
              </div>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
              >
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
                <option value="year">Este ano</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {moodEntries.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/70 mb-2">Nenhuma entrada de humor</h3>
                <p className="text-white/50">Comece registrando seu humor usando o botão acima</p>
              </div>
            ) : (
              moodEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getMoodColor(entry.mood)}`}>
                        <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{entry.cause}</h4>
                        <p className="text-sm text-white/70">{entry.notes}</p>
                        <div className="flex items-center space-x-2 text-xs text-white/50 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>{entry.date.toLocaleDateString('pt-BR')}</span>
                          <span>•</span>
                          <span>Intensidade: {entry.intensity}/10</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-white/50 hover:text-white p-1">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-white/50 hover:text-white p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <>
          {/* Statistics */}
          <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Estatísticas Mensais</h3>
              </div>
            </div>

            <div className="space-y-3">
              {monthlyStats.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50">Nenhuma estatística disponível</p>
                  <p className="text-white/30 text-sm">Registre seu humor para ver análises</p>
                </div>
              ) : (
                monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${stat.color}`}></div>
                      <span className="text-sm text-gray-300">{stat.mood}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{stat.percentage}%</span>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Goals and Insights */}
          <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Metas e Insights</h3>
            <div className="space-y-4">
              {monthlyStats.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/50">Nenhuma meta definida</p>
                  <p className="text-white/30 text-sm">Comece registrando seu humor para definir metas</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Target className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">Meta: 7 dias consecutivos</div>
                      <div className="text-white/70 text-sm">Progresso: 0/7 dias</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-white font-medium">Melhor humor da semana</div>
                      <div className="text-white/70 text-sm">Nenhuma entrada ainda</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'scheduling' && (
        <>
          {/* Session Scheduling */}
          <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center space-x-2 mb-6">
              <MessageCircle className="w-6 h-6 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Agendar Sessão com Psicólogo</h3>
            </div>

            <div className="space-y-6">
              {/* Session Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Tipo de Sessão:</label>
                <div className="grid grid-cols-2 gap-3">
                  {sessionTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSessionType(type.id)}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                        sessionType === type.id
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'bg-gray-800/30 border-gray-600/30 text-gray-300 hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="font-medium text-sm">{type.label}</div>
                      <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date and Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Data:</label>
                  <div className="grid grid-cols-7 gap-2">
                    {getNextWeekDates().map((dateInfo) => (
                      <button
                        key={dateInfo.date}
                        onClick={() => setSelectedDate(dateInfo.date)}
                        className={`p-2 rounded-lg text-center transition-all duration-200 ${
                          selectedDate === dateInfo.date
                            ? 'bg-white text-black'
                            : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/30'
                        }`}
                      >
                        <div className="text-xs text-gray-400">{dateInfo.day}</div>
                        <div className="font-medium">{dateInfo.dayNumber}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Horário:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg text-center transition-all duration-200 ${
                          selectedTime === time
                            ? 'bg-white text-black'
                            : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/30'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Session Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Observações (opcional):</label>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Descreva brevemente o que gostaria de abordar na sessão..."
                  className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 min-h-[80px]"
                />
              </div>

              {/* Schedule Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleScheduleSession}
                  disabled={!selectedDate || !selectedTime || !sessionType}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar Sessão</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HumorTracker;