import React, { ReactNode } from 'react';

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

const ModalContent: React.FC<ModalContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};

export default ModalContent;