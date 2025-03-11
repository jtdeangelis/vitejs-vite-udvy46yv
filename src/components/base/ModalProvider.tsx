import React, { createContext, useContext, ReactNode } from 'react';
import { useModal } from '../../hooks/useModal';

interface ModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({
  children,
  onClose,
  onOpen
}) => {
  const modal = useModal({ onClose, onOpen });

  return (
    <ModalContext.Provider value={modal}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};