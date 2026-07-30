import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type LoaderVariant = 'spinner' | 'dots' | 'pulse';
export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderColor = 'default' | 'primary' | 'white';
export type LoaderUsage = 'inline' | 'centered' | 'fullscreen';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: LoaderVariant;
  size?: LoaderSize;
  color?: LoaderColor;
  usage?: LoaderUsage;
}

const sizeStyles: Record<LoaderSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const dotsSizeStyles: Record<LoaderSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-4 h-4',
};

const colorStyles: Record<LoaderColor, string> = {
  default: 'text-gray-500 dark:text-gray-400',
  primary: 'text-amber-500',
  white: 'text-white',
};

const bgStyles: Record<LoaderColor, string> = {
  default: 'bg-gray-500 dark:bg-gray-400',
  primary: 'bg-amber-500',
  white: 'bg-white',
};

export const Loader = forwardRef<HTMLDivElement, LoaderProps>(
  (
    {
      variant = 'spinner',
      size = 'md',
      color = 'default',
      usage = 'inline',
      className = '',
      ...props
    },
    ref
  ) => {
    let wrapperStyles = '';
    if (usage === 'centered') {
      wrapperStyles = 'flex items-center justify-center w-full p-8';
    } else if (usage === 'fullscreen') {
      wrapperStyles = 'fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm';
    } else {
      wrapperStyles = 'inline-flex items-center justify-center';
    }

    const renderContent = () => {
      if (variant === 'pulse') {
        return (
          <div className={`rounded-full animate-pulse ${sizeStyles[size]} ${bgStyles[color]}`} />
        );
      }
      
      if (variant === 'dots') {
        const dotClass = `rounded-full animate-bounce ${dotsSizeStyles[size]} ${bgStyles[color]}`;
        return (
          <div className="flex items-center justify-center gap-1.5" dir="ltr">
            <div className={dotClass} style={{ animationDelay: '0ms' }} />
            <div className={dotClass} style={{ animationDelay: '150ms' }} />
            <div className={dotClass} style={{ animationDelay: '300ms' }} />
          </div>
        );
      }

      // Default spinner
      return <Loader2 className={`animate-spin ${sizeStyles[size]} ${colorStyles[color]}`} />;
    };

    return (
      <div 
        ref={ref}
        className={`${wrapperStyles} ${className}`.trim()}
        role="status"
        aria-live="polite"
        aria-busy="true"
        {...props}
      >
        {renderContent()}
        <span className="sr-only">جاري التحميل...</span>
      </div>
    );
  }
);

Loader.displayName = 'Loader';

