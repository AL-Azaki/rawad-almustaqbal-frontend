import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string | boolean;
  success?: boolean;
  fullWidth?: boolean;
  inputSize?: InputSize;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'py-2 px-3 text-sm rounded-lg',
  md: 'py-3 px-4 text-base rounded-xl',
  lg: 'py-4 px-5 text-lg rounded-2xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      leftIcon,
      rightIcon,
      error,
      success,
      fullWidth = true,
      inputSize = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseClasses = 'bg-white dark:bg-gray-700 border dark:text-white outline-none transition-shadow placeholder:text-gray-400 dark:placeholder:text-gray-400';
    
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
    const sizeClass = sizeStyles[inputSize];
    
    const hasRightIcon = !!rightIcon || isPassword || !!error || success;

    const inputClasses = [
      baseClasses,
      stateClasses,
      sizeClass,
      widthClass,
      leftIcon ? 'pl-11' : '',
      hasRightIcon ? 'pr-11' : '',
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={`relative ${fullWidth ? 'w-full flex flex-col' : 'inline-flex flex-col'}`}>
        <div className="relative w-full flex items-center">
          {leftIcon && (
            <div className="absolute left-0 pl-4 flex items-center pointer-events-none text-gray-400 z-10">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={!!error}
            {...props}
          />

          {hasRightIcon && (
            <div className="absolute right-0 pr-4 flex items-center text-gray-400 z-10">
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-amber-500 transition-colors pointer-events-auto cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              ) : error ? (
                <AlertCircle className="w-5 h-5 text-red-500 pointer-events-none" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 pointer-events-none" />
              ) : (
                <div className="pointer-events-none">{rightIcon}</div>
              )}
            </div>
          )}
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

Input.displayName = 'Input';
