import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string | boolean;
  success?: boolean;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      error,
      success,
      fullWidth = true,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'py-3 px-4 text-base rounded-xl bg-white dark:bg-gray-700 border dark:text-white outline-none transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-400 min-h-[120px] resize-y';
    
    let stateClasses = 'border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-transparent';
    if (error) {
      stateClasses = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent text-red-900 dark:text-red-100 placeholder:text-red-300';
    } else if (success) {
      stateClasses = 'border-green-500 focus:ring-2 focus:ring-green-500 focus:border-transparent';
    }

    if (disabled) {
      stateClasses += ' opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800';
    }

    const widthClass = fullWidth ? 'w-full' : '';

    const textareaClasses = [
      baseClasses,
      stateClasses,
      widthClass,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={`relative ${fullWidth ? 'w-full flex flex-col' : 'inline-flex flex-col'}`}>
        <textarea
          ref={ref}
          disabled={disabled}
          className={textareaClasses}
          aria-invalid={!!error}
          {...props}
        />
        {typeof error === 'string' && (
          <p className="mt-1.5 text-sm font-medium text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

