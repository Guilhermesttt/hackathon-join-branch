import React from 'react';
import { cn } from '../../utils/cn';
import LoadingSpinner from './LoadingSpinner';

const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  children,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-white text-black hover:bg-white/90 focus:ring-white/50',
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-transparent border border-white/30 text-white hover:bg-white/10 focus:ring-white/50',
    ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10 focus:ring-white/50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'bg-transparent border-2 border-white/50 text-white hover:bg-white hover:text-black focus:ring-white/50'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    default: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
    xl: 'px-8 py-4 text-xl rounded-2xl'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size={size === 'sm' ? 'sm' : 'default'} 
          variant={variant === 'default' ? 'secondary' : 'default'}
          className="mr-2" 
        />
      )}
      
      {!loading && LeftIcon && (
        <LeftIcon className={cn(
          'flex-shrink-0',
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
          children ? 'mr-2' : ''
        )} />
      )}
      
      {children}
      
      {!loading && RightIcon && (
        <RightIcon className={cn(
          'flex-shrink-0',
          size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
          children ? 'ml-2' : ''
        )} />
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;