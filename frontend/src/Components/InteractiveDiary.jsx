import React, { useState } from 'react';
import { BookOpen, Send, ChevronRight } from 'lucide-react';

const InteractiveDiary = () => {
  const [diaryEntry, setDiaryEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');

  const prompts = [
    "Como você se sentiu hoje?",
    "Qual foi o melhor momento do seu dia?",
    "O que você gostaria de melhorar amanhã?",
    "Por que você está grato hoje?",
    "Que desafio você enfrentou hoje?"
  ];

  // Array vazio para dados reais
  const recentEntries = [];

  const handleSaveEntry = () => {
    if (!diaryEntry.trim() || !selectedPrompt) return;
    
    // TODO: Implementar salvamento no Firebase
    console.log('Salvando reflexão:', { prompt: selectedPrompt, entry: diaryEntry });
    
    // Limpar formulário
    setDiaryEntry('');
    setSelectedPrompt('');
  };

  return (
    <div className="space-y-6 animation-initial animate-fade-in-up animation-delay-100">
      {/* Diary Writing */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-6 h-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-white">Diário Evolutivo</h2>
        </div>

        {/* Prompts */}
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-3">Escolha uma reflexão para começar:</p>
          <div className="space-y-2">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setSelectedPrompt(prompt)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  selectedPrompt === prompt
                    ? 'bg-white/10 border border-white/20 text-white'
                    : 'bg-gray-800/30 hover:bg-gray-700/30 text-gray-300'
                }`}
              >
                <span className="text-sm">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Writing Area */}
        <div className="space-y-4">
          {selectedPrompt && (
            <div className="bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-gray-300 text-sm font-medium">{selectedPrompt}</p>
            </div>
          )}
          
          <textarea
            value={diaryEntry}
            onChange={(e) => setDiaryEntry(e.target.value)}
            placeholder="Escreva seus pensamentos e sentimentos aqui..."
            className="w-full bg-gray-800/50 border border-gray-600/50 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 min-h-[120px]"
          />
          
          <div className="flex justify-end">
            <button 
              onClick={handleSaveEntry}
              disabled={!diaryEntry.trim() || !selectedPrompt}
              className="bg-gradient-to-r from-white to-gray-200 text-black px-6 py-2 rounded-lg font-medium hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Salvar Reflexão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white/10 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Reflexões Recentes</h3>
        <div className="space-y-3">
          {recentEntries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white/70 mb-2">Nenhuma reflexão ainda</h3>
              <p className="text-white/50">Comece escrevendo sua primeira reflexão acima</p>
            </div>
          ) : (
            recentEntries.map((entry, index) => (
              <button
                key={index}
                className="w-full text-left p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white text-sm mb-2">{entry.prompt}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{entry.content}</p>
                    <p className="text-gray-500 text-xs mt-2">{entry.date}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDiary;