import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageCircle, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

const PsychologistDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    pendingSessions: 0,
    totalPatients: 0
  });

  // Dados mockados para demonstração
  useEffect(() => {
    // Simular dados de sessões
    setUpcomingSessions([
      {
        id: 1,
        patientName: 'Maria Silva',
        date: '2024-01-15',
        time: '14:00',
        type: 'Individual',
        status: 'confirmed',
        notes: 'Primeira sessão - ansiedade'
      },
      {
        id: 2,
        patientName: 'João Santos',
        date: '2024-01-15',
        time: '15:30',
        type: 'Casal',
        status: 'pending',
        notes: 'Terapia de relacionamento'
      },
      {
        id: 3,
        patientName: 'Ana Costa',
        date: '2024-01-16',
        time: '09:00',
        type: 'Individual',
        status: 'confirmed',
        notes: 'Acompanhamento depressão'
      }
    ]);

    // Simular dados de pacientes
    setRecentPatients([
      {
        id: 1,
        name: 'Maria Silva',
        lastSession: '2024-01-10',
        nextSession: '2024-01-15',
        progress: 75,
        status: 'active'
      },
      {
        id: 2,
        name: 'João Santos',
        lastSession: '2024-01-08',
        nextSession: '2024-01-15',
        progress: 60,
        status: 'active'
      },
      {
        id: 3,
        name: 'Ana Costa',
        lastSession: '2024-01-12',
        nextSession: '2024-01-16',
        progress: 45,
        status: 'active'
      }
    ]);

    // Simular estatísticas
    setSessionStats({
      totalSessions: 24,
      completedSessions: 18,
      pendingSessions: 6,
      totalPatients: 12
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Sessões</p>
              <p className="text-2xl font-bold text-white">{sessionStats.totalSessions}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sessões Concluídas</p>
              <p className="text-2xl font-bold text-white">{sessionStats.completedSessions}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sessões Pendentes</p>
              <p className="text-2xl font-bold text-white">{sessionStats.pendingSessions}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Pacientes</p>
              <p className="text-2xl font-bold text-white">{sessionStats.totalPatients}</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Próximas Sessões</h3>
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Nova Sessão</span>
          </button>
        </div>

        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-white">{session.patientName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(session.date).toLocaleDateString('pt-BR')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{session.type}</span>
                    </span>
                  </div>
                  {session.notes && (
                    <p className="text-gray-400 text-sm mt-2">{session.notes}</p>
                  )}
                </div>
                <button className="text-gray-400 hover:text-white transition-colors duration-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Pacientes Recentes</h3>
        <div className="space-y-3">
          {recentPatients.map((patient) => (
            <div key={patient.id} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 hover:bg-gray-700/30 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-2">{patient.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                    <span>Última sessão: {new Date(patient.lastSession).toLocaleDateString('pt-BR')}</span>
                    <span>Próxima: {new Date(patient.nextSession).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Progresso:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${patient.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{patient.progress}%</span>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200">
                  Ver Perfil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      {/* Session Management */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gerenciar Sessões</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar sessões..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
              />
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nova Sessão</span>
            </button>
          </div>
        </div>

        {/* Session List */}
        <div className="space-y-3">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-white">{session.patientName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusText(session.status)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-300">
                    <span>{new Date(session.date).toLocaleDateString('pt-BR')} às {session.time}</span>
                    <span>{session.type}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-all duration-200">
                    Confirmar
                  </button>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all duration-200">
                    Editar
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      {/* Patient Management */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Gerenciar Pacientes</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pacientes..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200"
              />
            </div>
            <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Novo Paciente</span>
            </button>
          </div>
        </div>

        {/* Patient List */}
        <div className="space-y-3">
          {recentPatients.map((patient) => (
            <div key={patient.id} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-2">{patient.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-300 mb-3">
                    <span>Status: <span className="text-green-400">Ativo</span></span>
                    <span>Última sessão: {new Date(patient.lastSession).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">Progresso:</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${patient.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-white font-medium">{patient.progress}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-200">
                    Ver Perfil
                  </button>
                  <button className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-700 transition-all duration-200">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animation-initial animate-fade-in-up animation-delay-100">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard do Psicólogo</h1>
            <p className="text-gray-300">Gerencie suas sessões e pacientes</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Dr. Psicólogo</span>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-2">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
            { id: 'sessions', label: 'Sessões', icon: Calendar },
            { id: 'patients', label: 'Pacientes', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-black shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'sessions' && renderSessions()}
      {activeTab === 'patients' && renderPatients()}
    </div>
  );
};

export default PsychologistDashboard;
