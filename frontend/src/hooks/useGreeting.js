import { useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTimer } from './useTimer';

export const useGreeting = (userName) => {
  const currentTime = useTimer(60000); // Update every minute

  const greeting = useMemo(() => {
    const hour = currentTime.getHours();
    const name = userName || 'Usuário';
    
    if (hour < 12) {
      return { 
        text: `Bom dia, ${name}!`, 
        icon: Sun,
        period: 'morning'
      };
    }
    
    if (hour < 18) {
      return { 
        text: `Boa tarde, ${name}!`, 
        icon: Sun,
        period: 'afternoon'
      };
    }
    
    return { 
      text: `Boa noite, ${name}!`, 
      icon: Moon,
      period: 'evening'
    };
  }, [currentTime, userName]);

  return {
    ...greeting,
    currentTime,
    formattedDate: currentTime.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
};
