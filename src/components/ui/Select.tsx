import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | boolean;
  success?: boolean;
  fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      error,
      success,
      fullWidth = true,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'appearance-none py-3 px-4 rtl:pl-10 rtl:pr-4 ltr:pr-10 ltr:pl-4 text-base rounded-xl bg-white dark:bg-gray-700 border dark:text-white outline-none transition-shadow';
    
    let stateClasses = 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent';
    if (error) {
      stateClasses = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent text-red-900 dark:text-red-100';
    } else if (success) {
      stateClasses = 'border-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent';
    }

    if (disabled) {
      stateClasses += ' opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800';
    }

    const widthClass = fullWidth ? 'w-full' : '';

    const selectClasses = [
      baseClasses,
      stateClasses,
      widthClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={`relative ${fullWidth ? 'w-full flex flex-col' : 'inline-flex flex-col'}`}>
        <div className="relative w-full flex items-center">
          <select
            ref={ref}
            disabled={disabled}
            className={selectClasses}
            aria-invalid={!!error}
            {...props}
          >
            {children}
          </select>
          
          <div className="absolute top-1/2 -translate-y-1/2 left-4 pointer-events-none flex items-center text-gray-400">
             <ChevronDown className="w-5 h-5" />
          </div>
        </div>

        {typeof error === 'string' && (
          <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
