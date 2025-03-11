import React from 'react';
import { Check, X } from 'lucide-react';

interface ModalFooterProps {
  onCancel: () => void;
  onApply: () => void;
  cancelText?: string;
  applyText?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onApply,
  cancelText = 'Cancel',
  applyText = 'Apply Changes',
  isLoading = false,
  disabled = false
}) => {
  return (
    <div className="flex justify-end space-x-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        disabled={isLoading}
      >
        <span className="flex items-center">
          <X className="w-4 h-4 mr-2" />
          {cancelText}
        </span>
      </button>
      <button
        onClick={onApply}
        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
        disabled={isLoading || disabled}
      >
        <span className="flex items-center">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              {applyText}
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default ModalFooter;