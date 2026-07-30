import React from 'react';
import { X } from 'lucide-react';

export interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose, className = '' }) => {
  return (
    <div className={`flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 ${className}`}>
      <h3 id="modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
        {children}
      </h3>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

