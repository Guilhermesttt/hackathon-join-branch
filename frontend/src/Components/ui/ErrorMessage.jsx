import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const ErrorMessage = ({
  title = 'Erro',
  message,
  variant = 'default',
  dismissible = false,
  onDismiss,
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-red-500/10 border-red-500/20 text-red-400',
    destructive: 'bg-red-600/10 border-red-600/20 text-red-300',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
  };

  const iconVariants = {
    default: 'text-red-400',
    destructive: 'text-red-300',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  if (!message) return null;

  return (
    <div
      className={cn(
        'flex items-start space-x-3 p-4 rounded-xl border backdrop-blur-sm',
        variants[variant],
        className
      )}
      role="alert"
      aria-live="assertive"
      {...props}
    >
      <AlertCircle 
        className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconVariants[variant])} 
        aria-hidden="true" 
      />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium mb-1">
            {title}
          </h4>
        )}
        <p className="text-sm leading-relaxed">
          {message}
        </p>
      </div>
      
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Fechar mensagem de erro"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
