import React, { useState, useEffect } from 'react';
import { TrendingUp, Hash, MessageCircle, Users, Eye } from 'lucide-react';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';

const TrendingTopics = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock trending data
  const mockTrends = [
    {
      id: 1,
      hashtag: 'ansiedade',
      postCount: 1247,
      growth: '+15%',
      category: 'Saúde Mental',
      description: 'Discussões sobre manejo da ansiedade'
    },
    {
      id: 2,
      hashtag: 'meditação',
      postCount: 892,
      growth: '+8%',
      category: 'Bem-estar',
      description: 'Práticas de meditação e mindfulness'
    },
    {
      id: 3,
      hashtag: 'terapia',
      postCount: 654,
      growth: '+12%',
      category: 'Saúde Mental',
      description: 'Experiências e dicas sobre terapia'
    },
    {
      id: 4,
      hashtag: 'autoestima',
      postCount: 543,
      growth: '+20%',
      category: 'Desenvolvimento',
      description: 'Construindo amor próprio e confiança'
    },
    {
      id: 5,
      hashtag: 'relacionamentos',
      postCount: 432,
      growth: '+5%',
      category: 'Relacionamentos',
      description: 'Dicas para relacionamentos saudáveis'
    }
  ];

  useEffect(() => {
    const loadTrends = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setTrends(mockTrends);
      } catch (error) {
        console.error('Error loading trends:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, []);

  const handleTrendClick = (hashtag) => {
    // TODO: Navigate to hashtag search
    console.log('Searching for hashtag:', hashtag);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Saúde Mental':
        return 'text-blue-400';
      case 'Bem-estar':
        return 'text-green-400';
      case 'Desenvolvimento':
        return 'text-purple-400';
      case 'Relacionamentos':
        return 'text-pink-400';
      default:
        return 'text-white/60';
    }
  };

  if (loading) {
    return (
      <div className="bg-black border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-white/70">Carregando tendências...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-white/20 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="w-6 h-6 text-white" />
        <h2 className="text-xl font-bold text-white">Tendências</h2>
      </div>

      {/* Trending Topics */}
      <div className="space-y-3">
        {trends.map((trend, index) => (
          <button
            key={trend.id}
            onClick={() => handleTrendClick(trend.hashtag)}
            className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-white/50 font-bold">#{index + 1}</span>
                <Hash className="w-4 h-4 text-white/60" />
              </div>
              <div className="flex items-center space-x-1 text-green-400 text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>{trend.growth}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-white text-lg mb-1 group-hover:text-white/90 transition-colors">
              #{trend.hashtag}
            </h3>
            
            <p className="text-sm text-white/70 mb-2 leading-relaxed">
              {trend.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-white/60">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{trend.postCount.toLocaleString()} posts</span>
                </div>
                <span className={`${getCategoryColor(trend.category)} font-medium`}>
                  {trend.category}
                </span>
              </div>
              
              <Eye className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* View All Trends */}
      <div className="text-center mt-6 pt-4 border-t border-white/20">
        <Button
          variant="secondary"
          onClick={() => {
            // TODO: Navigate to trending page
            console.log('View all trends');
          }}
          className="w-full"
        >
          Ver todas as tendências
        </Button>
      </div>

      {/* Trending Stats */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {trends.reduce((sum, trend) => sum + trend.postCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-white/60">Posts hoje</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {trends.length}
            </div>
            <div className="text-sm text-white/60">Tópicos em alta</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingTopics;