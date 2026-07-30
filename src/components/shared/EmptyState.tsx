import React from 'react';
import { SearchX, FolderOpen, AlertOctagon, HelpCircle } from 'lucide-react';
import { Button, type ButtonProps } from '../ui/Button';

export type EmptyStateVariant = 'default' | 'search' | 'no-data' | 'error';
export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateAction extends Omit<ButtonProps, 'children'> {
  label: string;
}

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  withBackground?: boolean;
}

const variantIcons: Record<EmptyStateVariant, React.ElementType> = {
  default: HelpCircle,
  search: SearchX,
  'no-data': FolderOpen,
  error: AlertOctagon,
};

const variantColors: Record<EmptyStateVariant, { iconBg: string; iconColor: string }> = {
  default: { iconBg: 'bg-gray-50 dark:bg-gray-800', iconColor: 'text-gray-400 dark:text-gray-500' },
  search: { iconBg: 'bg-blue-50 dark:bg-blue-900/20', iconColor: 'text-blue-500 dark:text-blue-400' },
  'no-data': { iconBg: 'bg-amber-50 dark:bg-amber-900/20', iconColor: 'text-amber-500 dark:text-amber-400' },
  error: { iconBg: 'bg-red-50 dark:bg-red-900/20', iconColor: 'text-red-500 dark:text-red-400' },
};

const sizeStyles: Record<EmptyStateSize, { container: string; iconSize: string; title: string; desc: string }> = {
  sm: {
    container: 'py-6 px-4',
    iconSize: 'w-12 h-12 p-3',
    title: 'text-base',
    desc: 'text-xs',
  },
  md: {
    container: 'py-12 px-6',
    iconSize: 'w-16 h-16 p-4',
    title: 'text-lg',
    desc: 'text-sm',
  },
  lg: {
    container: 'py-16 px-8',
    iconSize: 'w-20 h-20 p-5',
    title: 'text-xl',
    desc: 'text-base',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  variant = 'default',
  size = 'md',
  primaryAction,
  secondaryAction,
  className = '',
  withBackground = true,
}) => {
  const IconComponent = variantIcons[variant];
  const { iconBg, iconColor } = variantColors[variant];
  const styles = sizeStyles[size];

  const bgClasses = withBackground 
    ? 'bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm' 
    : '';

  return (
    <div 
      className={`flex flex-col items-center justify-center text-center w-full ${styles.container} ${bgClasses} ${className}`.trim()}
      role="region"
      aria-label={title}
    >
      <div className={`rounded-full mb-4 flex items-center justify-center transition-colors ${iconBg}`}>
        {icon ? (
          icon
        ) : (
          <IconComponent className={`${styles.iconSize} ${iconColor}`} aria-hidden="true" />
        )}
      </div>
      
      <h3 className={`font-bold text-gray-900 dark:text-white mb-2 ${styles.title}`}>
        {title}
      </h3>
      
      {description && (
        <p className={`text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed ${styles.desc}`}>
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center justify-center gap-3 mt-8 w-full flex-wrap">
          {secondaryAction && (
            <Button 
              variant="outline" 
              {...secondaryAction}
            >
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button 
              variant="primary" 
              {...primaryAction}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

