import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Define the ModalState interface
export interface ModalState {
  kitchen: boolean;
  bedroom: boolean;
  bathroom: boolean;
  livingRoom: boolean;
  familyRoom: boolean;
  diningRoom: boolean;
  foyer: boolean;
  laundryRoom: boolean;
  garage: boolean;
  exterior: boolean;
  hallway: boolean;
  customRoom: boolean;
  costBreakdown: boolean;
  costSettings: boolean;
  saveProject: boolean;
  projectList: boolean;
  auth: boolean;
  share: boolean;
}

// Define the context type
interface ModalContextType {
  modals: ModalState;
  openModal: (modalName: keyof ModalState) => void;
  closeModal: (modalName: keyof ModalState) => void;
  closeAllModals: () => void;
}

// Create the context with a default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Initial state for modals
const initialModalState: ModalState = {
  kitchen: false,
  bedroom: false,
  bathroom: false,
  livingRoom: false,
  familyRoom: false,
  diningRoom: false,
  foyer: false,
  laundryRoom: false,
  garage: false,
  exterior: false,
  hallway: false,
  customRoom: false,
  costBreakdown: false,
  costSettings: false,
  saveProject: false,
  projectList: false,
  auth: false,
  share: false
};

// Provider component
export const ModalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modals, setModals] = useState<ModalState>(initialModalState);

  const openModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(initialModalState);
  }, []);

  const value = {
    modals,
    openModal,
    closeModal,
    closeAllModals
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModalState = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalState must be used within a ModalStateProvider');
  }
  return context;
};