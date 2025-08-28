import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  className,
  type = 'text',
  variant = 'default',
  size = 'default',
  error,
  label,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onLeftIconClick,
  onRightIconClick,
  ...props
}, ref) => {
  const baseClasses = 'w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black';
  
  const variants = {
    default: 'bg-black/50 border border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/50',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/50',
    filled: 'bg-white/5 border border-white/10 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/50',
    outline: 'bg-transparent border-2 border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:ring-white/50'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    default: 'px-4 py-3 text-base rounded-xl',
    lg: 'px-6 py-4 text-lg rounded-2xl'
  };
  
  const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
  
  const inputClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    errorClasses,
    className
  );

  const hasLeftIcon = LeftIcon && onLeftIconClick;
  const hasRightIcon = RightIcon && onRightIconClick;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {hasLeftIcon && (
          <button
            type="button"
            onClick={onLeftIconClick}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label="Ação do ícone esquerdo"
          >
            <LeftIcon className="w-4 h-4" />
          </button>
        )}
        
        <input
          type={type}
          className={cn(
            inputClasses,
            hasLeftIcon && 'pl-10',
            hasRightIcon && 'pr-10'
          )}
          ref={ref}
          {...props}
        />
        
        {hasRightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-white/50 hover:text-white/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded"
            aria-label="Ação do ícone direito"
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-white/50">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
