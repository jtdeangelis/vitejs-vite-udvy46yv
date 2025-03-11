import { useState, useCallback } from 'react';

// Custom hook to manage modal states to reduce re-renders in App.tsx
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
  customRoom: boolean;
  costBreakdown: boolean;
  costSettings: boolean;
  saveProject: boolean;
  projectList: boolean;
  auth: boolean;
}

export function useModalState() {
  const [modals, setModals] = useState<ModalState>({
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
    customRoom: false,
    costBreakdown: false,
    costSettings: false,
    saveProject: false,
    projectList: false,
    auth: false,
  });

  const openModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  }, []);

  return { modals, openModal, closeModal };
}