import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { useModalState } from '../../context/ModalContext';
import { useRoomHandlers } from '../../hooks/useRoomHandlers';
import KitchenCustomizationModal from '../KitchenCustomizationModal';
import BedroomCustomizationModal from '../BedroomCustomizationModal';
import BathroomCustomizationModal from '../BathroomCustomizationModal';
import LivingRoomCustomizationModal from '../LivingRoomCustomizationModal';
import FamilyRoomCustomizationModal from '../FamilyRoomCustomizationModal';
import DiningRoomCustomizationModal from '../DiningRoomCustomizationModal';
import FoyerCustomizationModal from '../FoyerCustomizationModal';
import LaundryRoomCustomizationModal from '../LaundryRoomCustomizationModal';
import GarageCustomizationModal from '../GarageCustomizationModal';
import ExteriorCustomizationModal from '../ExteriorCustomizationModal';
import HallwayCustomizationModal from '../HallwayCustomizationModal';
import CustomRoomModal from '../CustomRoomModal';
import CostBreakdownModal from '../CostBreakdownModal';
import CostSettingsModal from '../CostSettingsModal';
import SaveProjectModal from '../SaveProjectModal';
import ProjectListModal from '../ProjectListModal';
import AuthModal from '../AuthModal';

interface ModalContainerProps {
  selectedRoomId: number | null;
  selectedRoomName: string;
  authMode: 'signin' | 'signup';
  onAuthSuccess: () => void;
  onCustomRoomSave: (name: string, options: any) => void;
  onLoadProject: (project: any) => void;
  getTotalCost: () => number;
  projectId?: string;
  onProjectSaved?: (projectId: string) => void;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  selectedRoomId,
  selectedRoomName,
  authMode,
  onAuthSuccess,
  onCustomRoomSave,
  onLoadProject,
  getTotalCost,
  projectId,
  onProjectSaved
}) => {
  const { state, dispatch } = useProject();
  const { modals, closeModal } = useModalState();
  const { updateRoomCustomization } = useRoomHandlers();

  const handleModalClose = (modalType: string, roomType: string) => {
    if (selectedRoomId) {
      updateRoomCustomization(roomType, selectedRoomId, true);
    }
    closeModal(modalType as any);
  };

  return (
    <>
      <KitchenCustomizationModal
        isOpen={modals.kitchen}
        onClose={() => handleModalClose('kitchen', 'fixed')}
        kitchenOptions={state.kitchenOptions}
        setKitchenOptions={(options) => dispatch({ 
          type: 'UPDATE_KITCHEN_OPTIONS', 
          payload: options 
        })}
        onApply={() => handleModalClose('kitchen', 'fixed')}
      />

      {selectedRoomId && state.bedroomOptionsMap[selectedRoomId] && (
        <BedroomCustomizationModal
          isOpen={modals.bedroom}
          onClose={() => handleModalClose('bedroom', 'bedroom')}
          bedroomOptions={state.bedroomOptionsMap[selectedRoomId]}
          setBedroomOptions={(options) => dispatch({
            type: 'UPDATE_BEDROOM_OPTIONS',
            payload: { id: selectedRoomId, options }
          })}
          roomName={selectedRoomName}
          onApply={() => handleModalClose('bedroom', 'bedroom')}
        />
      )}

      {selectedRoomId && state.bathroomOptionsMap[selectedRoomId] && (
        <BathroomCustomizationModal
          isOpen={modals.bathroom}
          onClose={() => handleModalClose('bathroom', 'bathroom')}
          bathroomOptions={state.bathroomOptionsMap[selectedRoomId]}
          setBathroomOptions={(options) => dispatch({
            type: 'UPDATE_BATHROOM_OPTIONS',
            payload: { id: selectedRoomId, options }
          })}
          roomName={selectedRoomName}
          onApply={() => handleModalClose('bathroom', 'bathroom')}
        />
      )}
      
      <LivingRoomCustomizationModal
        isOpen={modals.livingRoom}
        onClose={() => handleModalClose('livingRoom', 'fixed')}
        livingRoomOptions={state.livingRoomOptions}
        setLivingRoomOptions={(options) => dispatch({
          type: 'UPDATE_LIVING_ROOM_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('livingRoom', 'fixed')}
      />
      
      <FamilyRoomCustomizationModal
        isOpen={modals.familyRoom}
        onClose={() => handleModalClose('familyRoom', 'fixed')}
        familyRoomOptions={state.familyRoomOptions}
        setFamilyRoomOptions={(options) => dispatch({
          type: 'UPDATE_FAMILY_ROOM_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('familyRoom', 'fixed')}
      />

      <DiningRoomCustomizationModal
        isOpen={modals.diningRoom}
        onClose={() => handleModalClose('diningRoom', 'fixed')}
        diningRoomOptions={state.diningRoomOptions}
        setDiningRoomOptions={(options) => dispatch({
          type: 'UPDATE_DINING_ROOM_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('diningRoom', 'fixed')}
      />
      
      <FoyerCustomizationModal
        isOpen={modals.foyer}
        onClose={() => handleModalClose('foyer', 'fixed')}
        foyerOptions={state.foyerOptions}
        setFoyerOptions={(options) => dispatch({
          type: 'UPDATE_FOYER_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('foyer', 'fixed')}
      />
      
      <LaundryRoomCustomizationModal
        isOpen={modals.laundryRoom}
        onClose={() => handleModalClose('laundryRoom', 'fixed')}
        laundryRoomOptions={state.laundryRoomOptions}
        setLaundryRoomOptions={(options) => dispatch({
          type: 'UPDATE_LAUNDRY_ROOM_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('laundryRoom', 'fixed')}
      />
      
      <GarageCustomizationModal
        isOpen={modals.garage}
        onClose={() => handleModalClose('garage', 'fixed')}
        garageOptions={state.garageOptions}
        setGarageOptions={(options) => dispatch({
          type: 'UPDATE_GARAGE_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('garage', 'fixed')}
      />
      
      <ExteriorCustomizationModal
        isOpen={modals.exterior}
        onClose={() => handleModalClose('exterior', 'fixed')}
        exteriorOptions={state.exteriorOptions}
        setExteriorOptions={(options) => dispatch({
          type: 'UPDATE_EXTERIOR_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('exterior', 'fixed')}
      />

      <HallwayCustomizationModal
        isOpen={modals.hallway}
        onClose={() => handleModalClose('hallway', 'fixed')}
        hallwayOptions={state.hallwayOptions}
        setHallwayOptions={(options) => dispatch({
          type: 'UPDATE_HALLWAY_OPTIONS',
          payload: options
        })}
        onApply={() => handleModalClose('hallway', 'fixed')}
      />
      
      <CustomRoomModal
        isOpen={modals.customRoom}
        onClose={() => handleModalClose('customRoom', 'custom')}
        onSave={onCustomRoomSave}
        existingOptions={selectedRoomId ? state.customRooms.find(r => r.id === selectedRoomId)?.options : undefined}
        existingName={selectedRoomId ? state.customRooms.find(r => r.id === selectedRoomId)?.name : undefined}
      />
      
      <CostBreakdownModal
        isOpen={modals.costBreakdown}
        onClose={() => closeModal('costBreakdown')}
        rooms={state.fixedRooms}
        bedrooms={state.bedrooms}
        bathrooms={state.bathrooms}
        customRooms={state.customRooms}
        totalCost={getTotalCost()}
      />

      <CostSettingsModal
        isOpen={modals.costSettings}
        onClose={() => closeModal('costSettings')}
      />

      <SaveProjectModal
        isOpen={modals.saveProject}
        onClose={() => closeModal('saveProject')}
        projectData={state}
        propertyDetails={state.propertyDetails}
        onProjectSaved={onProjectSaved}
      />

      <ProjectListModal
        isOpen={modals.projectList}
        onClose={() => closeModal('projectList')}
        onLoadProject={onLoadProject}
      />

      <AuthModal
        isOpen={modals.auth}
        onClose={() => closeModal('auth')}
        mode={authMode}
        onSuccess={onAuthSuccess}
      />
    </>
  );
};

export default ModalContainer;