import React, { ReactNode } from 'react';

interface ModalActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const ModalActions: React.FC<ModalActionsProps> = ({ 
  children, 
  align = 'right',
  className = ''
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  return (
    <div className={`
      px-6 py-4 border-t border-gray-200 
      flex items-center gap-3 
      ${alignmentClasses[align]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ModalActions;