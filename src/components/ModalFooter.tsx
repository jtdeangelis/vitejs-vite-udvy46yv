import React from 'react';
import { Check } from 'lucide-react';

interface ModalFooterProps {
  onCancel: () => void;
  onApply: () => void;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ onCancel, onApply }) => {
  return (
    <div className="mt-8 flex justify-end gap-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onApply}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <Check className="w-4 h-4" />
        Apply Changes
      </button>
    </div>
  );
};

export default ModalFooter;