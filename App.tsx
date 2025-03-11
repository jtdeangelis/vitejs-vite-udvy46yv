import React, { useState, useEffect } from 'react';
import { useProject } from './context/ProjectContext';
import { useModalState } from './context/ModalContext';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import TabContainer from './components/TabContainer';
import ModalContainer from './components/modals/ModalContainer';
import { useRoomHandlers } from './hooks/useRoomHandlers';
import { useMemoizedCalculations } from './hooks/useMemoizedCalculations';
import { Room, CustomRoomOptions } from './types';

function App() {
  const { state, dispatch } = useProject();
  const { modals, openModal, closeModal } = useModalState();
  const { user, signOut } = useAuth();
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>();
  const roomHandlers = useRoomHandlers();
  const { totalCost } = useMemoizedCalculations(
    state.fixedRooms,
    state.bedrooms,
    state.bathrooms,
    state.customRooms
  );

  const handleSaveProject = () => {
    openModal('saveProject');
  };

  const handleProjectSaved = (projectId: string) => {
    setCurrentProjectId(projectId);
  };

  const handleLoadProject = (projectData: any) => {
    dispatch({ type: 'LOAD_PROJECT', payload: projectData });
    if (projectData.id) {
      setCurrentProjectId(projectData.id);
    }
  };

  const handleCustomizeRoom = (roomName: string) => {
    const modalMap: Record<string, keyof typeof modals> = {
      'Kitchen': 'kitchen',
      'Living Room': 'livingRoom',
      'Family Room': 'familyRoom',
      'Dining Room': 'diningRoom',
      'Foyer': 'foyer',
      'Laundry Room': 'laundryRoom',
      'Garage': 'garage',
      'Exterior': 'exterior',
      'Hallway': 'hallway'
    };

    const modalKey = modalMap[roomName];
    if (modalKey) {
      const room = state.fixedRooms.find(r => r.name === roomName);
      if (room) {
        dispatch({ 
          type: 'UPDATE_SELECTED_ROOM', 
          payload: { id: room.id, name: roomName } 
        });
      }
      openModal(modalKey);
    }
  };

  return (
    <>
      <MainLayout
        onOpenSettings={() => openModal('costSettings')}
        onOpenSaveProject={handleSaveProject}
        onOpenProjectList={() => openModal('projectList')}
        onOpenSignIn={() => openModal('auth')}
      >
        <TabContainer
          propertyDetails={state.propertyDetails}
          setPropertyDetails={(details) => dispatch({
            type: 'UPDATE_PROPERTY_DETAILS',
            payload: details
          })}
          fixedRooms={state.fixedRooms}
          bedrooms={state.bedrooms}
          bathrooms={state.bathrooms}
          customRooms={state.customRooms}
          doors={state.doors}
          onCustomizeRoom={handleCustomizeRoom}
          onAddBedroom={roomHandlers.addBedroom}
          onDeleteBedroom={roomHandlers.deleteBedroom}
          onCustomizeBedroom={(id, name) => {
            dispatch({ 
              type: 'UPDATE_SELECTED_ROOM', 
              payload: { id, name } 
            });
            openModal('bedroom');
          }}
          onAddBathroom={roomHandlers.addBathroom}
          onDeleteBathroom={roomHandlers.deleteBathroom}
          onCustomizeBathroom={(id, name) => {
            dispatch({ 
              type: 'UPDATE_SELECTED_ROOM', 
              payload: { id, name } 
            });
            openModal('bathroom');
          }}
          onAddCustomRoom={roomHandlers.addCustomRoom}
          onEditCustomRoom={roomHandlers.editCustomRoom}
          onDeleteCustomRoom={roomHandlers.deleteCustomRoom}
          onCustomizeCustomRoom={(id) => {
            const room = state.customRooms.find(r => r.id === id);
            if (room) {
              dispatch({ 
                type: 'UPDATE_SELECTED_ROOM', 
                payload: { id, name: room.name } 
              });
              openModal('customRoom');
            }
          }}
          onAddDoor={(door) => dispatch({ type: 'ADD_DOOR', payload: door })}
          onUpdateDoor={(id, updates) => dispatch({
            type: 'UPDATE_DOOR',
            payload: { id, updates }
          })}
          onDeleteDoor={(id) => dispatch({
            type: 'DELETE_DOOR',
            payload: { id }
          })}
          totalCost={totalCost}
          projectId={currentProjectId}
        />

        <ModalContainer
          selectedRoomId={state.selectedRoom?.id || null}
          selectedRoomName={state.selectedRoom?.name || ''}
          authMode="signin"
          onAuthSuccess={() => {}}
          onCustomRoomSave={(name: string, options: CustomRoomOptions) => 
            roomHandlers.addCustomRoom(name, options)
          }
          onLoadProject={handleLoadProject}
          getTotalCost={() => totalCost}
          projectId={currentProjectId}
          onProjectSaved={handleProjectSaved}
        />
      </MainLayout>
    </>
  );
}

export default App;