import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200';
  
  const variants = {
    default: 'bg-white/20 text-white border border-white/30',
    primary: 'bg-white text-black',
    secondary: 'bg-white/10 text-white/80 border border-white/20',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    outline: 'bg-transparent border border-white/50 text-white'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs rounded-full',
    default: 'px-3 py-1 text-sm rounded-full',
    lg: 'px-4 py-2 text-base rounded-xl'
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;