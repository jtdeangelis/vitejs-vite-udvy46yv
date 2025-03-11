import { useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { CustomRoomOptions } from '../types';

export function useRoomHandlers() {
  const { dispatch } = useProject();

  const addBedroom = useCallback((name: string) => {
    dispatch({ type: 'ADD_BEDROOM', payload: { name } });
  }, [dispatch]);

  const deleteBedroom = useCallback((id: number) => {
    dispatch({ type: 'DELETE_BEDROOM', payload: { id } });
  }, [dispatch]);

  const addBathroom = useCallback((name: string) => {
    dispatch({ type: 'ADD_BATHROOM', payload: { name } });
  }, [dispatch]);

  const deleteBathroom = useCallback((id: number) => {
    dispatch({ type: 'DELETE_BATHROOM', payload: { id } });
  }, [dispatch]);

  const addCustomRoom = useCallback((name: string, options: CustomRoomOptions) => {
    dispatch({ type: 'ADD_CUSTOM_ROOM', payload: { name, options } });
  }, [dispatch]);

  const editCustomRoom = useCallback((id: number, name: string, options: CustomRoomOptions) => {
    dispatch({ type: 'EDIT_CUSTOM_ROOM', payload: { id, name, options } });
  }, [dispatch]);

  const deleteCustomRoom = useCallback((id: number) => {
    dispatch({ type: 'DELETE_CUSTOM_ROOM', payload: { id } });
  }, [dispatch]);

  const updateRoomCustomization = useCallback((roomType: string, roomId: number, isCustomized: boolean) => {
    dispatch({ 
      type: 'UPDATE_ROOM_CUSTOMIZATION', 
      payload: { roomType, roomId, isCustomized } 
    });
  }, [dispatch]);

  return {
    addBedroom,
    deleteBedroom,
    addBathroom,
    deleteBathroom,
    addCustomRoom,
    editCustomRoom,
    deleteCustomRoom,
    updateRoomCustomization
  };
}