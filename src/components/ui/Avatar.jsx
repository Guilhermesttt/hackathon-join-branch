import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

const Avatar = React.forwardRef(({
  src,
  alt,
  size = 'default',
  isOnline = false,
  className,
  fallback,
  ...props
}, ref) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    default: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  const onlineIndicatorSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    default: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
    '3xl': 'w-6 h-6'
  };

  return (
    <div className={cn('relative inline-block', className)} ref={ref} {...props}>
      <div className={cn(
        'rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center overflow-hidden',
        sizes[size]
      )}>
        {src ? (
          <img 
            src={src} 
            alt={alt || 'Avatar'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        <div className={cn(
          'w-full h-full flex items-center justify-center',
          src ? 'hidden' : 'flex'
        )}>
          {fallback || <User className="w-1/2 h-1/2 text-white/70" />}
        </div>
      </div>
      
      {isOnline && (
        <div className={cn(
          'absolute bottom-0 right-0 bg-green-400 border-2 border-black rounded-full',
          onlineIndicatorSizes[size]
        )} />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;