import React from 'react';

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-900/30 ${className}`}>
      {children}
    </div>
  );
};
