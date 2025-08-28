import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Frown, 
  Zap, 
  HelpCircle, 
  Calendar, 
  MessageSquare, 
  Users, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Star,
  Search,
  Filter,
  Plus,
  ArrowRight,
  User
} from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const TherapySessions = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data for now - replace with real Firebase data
  const availableTherapists = [
    {
      id: 1,
      name: 'Dra. Ana Silva',
      specialty: 'Psicóloga Clínica',
      crp: '06/123456',
      rating: 4.9,
      reviews: 127,
      experience: '8 anos',
      acceptsOnline: true,
      location: 'São Paulo, SP',
      avatar: null,
      bio: 'Especialista em ansiedade, depressão e estresse. Trabalho com abordagem cognitivo-comportamental e mindfulness.',
      availability: [
        { day: 'Segunda', time: '14:00 - 18:00' },
        { day: 'Terça', time: '09:00 - 17:00' },
        { day: 'Quarta', time: '14:00 - 18:00' },
        { day: 'Quinta', time: '09:00 - 17:00' },
        { day: 'Sexta', time: '14:00 - 18:00' }
      ],
      price: 'R$ 150,00',
      sessionType: 'Online/Presencial'
    },
    {
      id: 2,
      name: 'Dr. Carlos Santos',
      specialty: 'Psicólogo',
      crp: '06/789012',
      rating: 4.8,
      reviews: 89,
      experience: '12 anos',
      acceptsOnline: true,
      location: 'Rio de Janeiro, RJ',
      avatar: null,
      bio: 'Especialista em TDAH, autismo e desenvolvimento infantil. Abordagem humanista e integrativa.',
      availability: [
        { day: 'Segunda', time: '08:00 - 16:00' },
        { day: 'Terça', time: '08:00 - 16:00' },
        { day: 'Quarta', time: '08:00 - 16:00' },
        { day: 'Quinta', time: '08:00 - 16:00' },
        { day: 'Sexta', time: '08:00 - 16:00' }
      ],
      price: 'R$ 180,00',
      sessionType: 'Online/Presencial'
    },
    {
      id: 3,
      name: 'Dra. Maria Costa',
      specialty: 'Psicóloga Especialista',
      crp: '06/345678',
      rating: 4.7,
      reviews: 156,
      experience: '15 anos',
      acceptsOnline: false,
      location: 'Belo Horizonte, MG',
      avatar: null,
      bio: 'Especialista em trauma, TEPT e EMDR. Abordagem psicodinâmica e técnicas de reprocessamento.',
      availability: [
        { day: 'Segunda', time: '13:00 - 19:00' },
        { day: 'Terça', time: '13:00 - 19:00' },
        { day: 'Quarta', time: '13:00 - 19:00' },
        { day: 'Quinta', time: '13:00 - 19:00' },
        { day: 'Sexta', time: '13:00 - 19:00' }
      ],
      price: 'R$ 200,00',
      sessionType: 'Presencial'
    }
  ];

  const scheduledSessions = [
    {
      id: 1,
      therapist: 'Dra. Ana Silva',
      date: '2024-01-15',
      time: '14:00',
      duration: '50 min',
      type: 'Online',
      status: 'confirmed'
    },
    {
      id: 2,
      therapist: 'Dr. Carlos Santos',
      date: '2024-01-18',
      time: '10:00',
      duration: '50 min',
      type: 'Presencial',
      status: 'pending'
    }
  ];

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
  }, []);

  const filteredTherapists = availableTherapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'online' && therapist.acceptsOnline) ||
                         (filterType === 'presencial' && !therapist.acceptsOnline);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-black py-8 animation-initial animate-fade-in-up animation-delay-100">
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Sessões de Terapia</h2>
          </div>
          <button className="bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm">
            <Plus className="w-4 h-4 inline mr-2" />
            Nova Sessão
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'available'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Terapeutas Disponíveis
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'scheduled'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Sessões Agendadas
          </button>
        </div>

        {activeTab === 'available' ? (
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar terapeutas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="all">Todos</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>

            {/* Therapists List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredTherapists.map((therapist) => (
                <div
                  key={therapist.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                      {therapist.avatar ? (
                        <img src={therapist.avatar} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        <User className="w-8 h-8 text-white/70" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-white text-lg">{therapist.name}</h3>
                          <p className="text-white/70 text-sm">{therapist.specialty}</p>
                          <p className="text-white/50 text-xs">CRP: {therapist.crp}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-white text-sm">{therapist.rating}</span>
                            <span className="text-white/50 text-xs">({therapist.reviews})</span>
                          </div>
                          <p className="text-white/70 text-sm">{therapist.price}</p>
                        </div>
                      </div>

                      <p className="text-white/80 text-sm mb-3">{therapist.bio}</p>

                      <div className="flex items-center space-x-4 text-xs text-white/60 mb-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{therapist.experience}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{therapist.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {therapist.acceptsOnline ? (
                            <Video className="w-3 h-3 text-green-400" />
                          ) : (
                            <Phone className="w-3 h-3 text-blue-400" />
                          )}
                          <span>{therapist.sessionType}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button onClick={() => navigate('/user/' + encodeURIComponent(therapist.name).toLowerCase().replace(/%20/g,'-'))} className="bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm">
                          Ver Perfil
                        </button>
                        <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-white/90 transition-all duration-300 text-sm">
                          Agendar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-lg">Nenhuma sessão agendada</p>
                <p className="text-white/30 text-sm mt-2">Agende sua primeira sessão com um terapeuta</p>
              </div>
            ) : (
              scheduledSessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white/70" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{session.therapist}</h3>
                        <div className="flex items-center space-x-4 text-sm text-white/70">
                          <span>{session.date} às {session.time}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                          <span>•</span>
                          <span>{session.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        session.status === 'confirmed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {session.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                      </span>
                      <button className="bg-white/10 border border-white/30 text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapySessions;