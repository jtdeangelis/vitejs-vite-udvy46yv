import React, { ReactNode } from 'react';
import BaseModal from './base/BaseModal';
import ModalContent from './base/ModalContent';
import ModalSection from './base/ModalSection';
import NotesInput from './NotesInput';
import CustomLineItemInput from './CustomLineItemInput';
import { CustomLineItem } from '../types';

interface ModalTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onApply: () => void;
  children: ReactNode;
  notes?: string;
  onUpdateNotes?: (notes: string) => void;
  customLineItems?: CustomLineItem[];
  onUpdateLineItems?: (lineItems: CustomLineItem[]) => void;
  showNotes?: boolean;
  showCustomLineItems?: boolean;
}

const ModalTemplate: React.FC<ModalTemplateProps> = ({
  isOpen,
  onClose,
  title,
  onApply,
  children,
  notes = '',
  onUpdateNotes,
  customLineItems = [],
  onUpdateLineItems,
  showNotes = true,
  showCustomLineItems = true
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onApply={onApply}
    >
      <ModalContent>
        <ModalSection title="Room Details">
          {children}
        </ModalSection>

        {showCustomLineItems && onUpdateLineItems && (
          <ModalSection 
            title="Custom Line Items"
            description="Add any additional items or costs specific to this room"
          >
            <CustomLineItemInput
              lineItems={customLineItems}
              onUpdateLineItems={onUpdateLineItems}
            />
          </ModalSection>
        )}
        
        {showNotes && onUpdateNotes && (
          <ModalSection 
            title="Notes"
            description="Add any additional notes or comments about this room"
          >
            <NotesInput
              notes={notes}
              onUpdateNotes={onUpdateNotes}
            />
          </ModalSection>
        )}
      </ModalContent>
    </BaseModal>
  );
};

export default ModalTemplate;