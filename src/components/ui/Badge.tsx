import React, { forwardRef } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  shape?: BadgeShape;
  icon?: React.ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-transparent',
  primary: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 border-transparent',
  secondary: 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-transparent',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-transparent',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-transparent',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-transparent',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-transparent',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-500 dark:bg-gray-400',
  primary: 'bg-amber-500',
  secondary: 'bg-gray-400 dark:bg-gray-600',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const shapeStyles: Record<BadgeShape, string> = {
  rounded: 'rounded-md',
  pill: 'rounded-full',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'default',
      size = 'sm',
      shape = 'pill',
      icon,
      dot = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'inline-flex items-center justify-center gap-1.5 font-bold transition-colors border whitespace-nowrap';
    
    const badgeClasses = [
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      shapeStyles[shape],
      className,
    ].filter(Boolean).join(' ');

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {dot && (
          <span 
            className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} 
            aria-hidden="true" 
          />
        )}
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </span>
    );
  }
);

Badge.displayName = 'Badge';
