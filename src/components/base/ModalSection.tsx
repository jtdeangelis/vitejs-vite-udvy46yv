import React, { ReactNode } from 'react';

interface ModalSectionProps {
  title: string;
  children: ReactNode;
  description?: string;
}

const ModalSection: React.FC<ModalSectionProps> = ({ title, children, description }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default ModalSection;