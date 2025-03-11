import React from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  onClick: () => void;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share Project
    </button>
  );
};

export default ShareButton;