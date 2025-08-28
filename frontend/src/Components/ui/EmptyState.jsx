import React from 'react';
import { cn } from '../../utils/cn';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'text-white/70',
    muted: 'text-white/50',
    primary: 'text-white/80'
  };

  const iconVariants = {
    default: 'text-white/40',
    muted: 'text-white/30',
    primary: 'text-white/50'
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className
      )}
      {...props}
    >
      {Icon && (
        <div className={cn('w-16 h-16 mb-4', iconVariants[variant])}>
          <Icon className="w-full h-full" aria-hidden="true" />
        </div>
      )}
      
      {title && (
        <h3 className={cn('text-xl font-medium mb-2', variants[variant])}>
          {title}
        </h3>
      )}
      
      {description && (
        <p className={cn('text-base leading-relaxed max-w-md', variants[variant])}>
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';

export default EmptyState;
