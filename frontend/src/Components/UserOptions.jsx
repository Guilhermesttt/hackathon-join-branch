import React from 'react';
import { Settings, User, Bell, HelpCircle, LogOut, Shield } from 'lucide-react';

const UserOptions = () => {
  const options = [
    {
      id: 1,
      title: 'Opções',
      icon: Settings,
      color: 'from-white to-gray-200',
      description: 'Configurações gerais'
    },
    {
      id: 2,
      title: 'Ativações',
      icon: Bell,
      color: 'from-white to-gray-200',
      description: 'Notificações e alertas'
    },
    {
      id: 3,
      title: 'Sobre Nós',
      icon: HelpCircle,
      color: 'from-white to-gray-200',
      description: 'Informações do aplicativo'
    },
    {
      id: 4,
      title: 'Sair',
      icon: LogOut,
      color: 'from-white to-gray-200',
      description: 'Encerrar sessão'
    },
    {
      id: 5,
      title: 'Excluir Conta',
      icon: Shield,
      color: 'from-white to-gray-200',
      description: 'Remover conta permanentemente'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-6 h-6 text-gray-400" />
        <h2 className="text-xl font-semibold text-white">Opções do Usuário</h2>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              className="w-full bg-white/5 border border-gray-200/20 rounded-xl p-4 hover:bg-white/10 hover:border-gray-300/20 hover:scale-105 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-white">{option.title}</h3>
                  <p className="text-sm text-gray-400">{option.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserOptions;