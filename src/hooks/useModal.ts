import { useState, useCallback, useEffect } from 'react';

interface UseModalProps {
  onClose?: () => void;
  onOpen?: () => void;
  initialState?: boolean;
}

export const useModal = ({ onClose, onOpen, initialState = false }: UseModalProps = {}) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      onOpen?.();
    }
  }, [isOpen, hasOpened, onOpen]);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    hasOpened
  };
};