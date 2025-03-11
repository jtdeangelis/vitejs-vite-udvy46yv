import React from 'react';
import { motion } from 'framer-motion';

interface ModalOverlayProps {
  onClick: () => void;
  isOpen: boolean;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClick, isOpen }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClick}
      aria-hidden="true"
    />
  );
};

export default ModalOverlay;