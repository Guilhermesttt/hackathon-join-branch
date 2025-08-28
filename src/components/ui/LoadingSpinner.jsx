import React from 'react';
import { cn } from '../../utils/cn';

const LoadingSpinner = ({ 
  size = 'default', 
  variant = 'default',
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    default: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const variants = {
    default: 'border-white/30 border-t-white',
    primary: 'border-blue-500/30 border-t-blue-500',
    secondary: 'border-gray-500/30 border-t-gray-500',
    success: 'border-green-500/30 border-t-green-500',
    warning: 'border-yellow-500/30 border-t-yellow-500',
    error: 'border-red-500/30 border-t-red-500'
  };

  return (
    <div
      className={cn(
        'border-2 rounded-full animate-spin',
        sizes[size],
        variants[variant],
        className
      )}
      role="status"
      aria-label="Carregando"
      {...props}
    >
      <span className="sr-only">Carregando...</span>
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;