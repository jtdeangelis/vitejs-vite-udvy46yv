import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, IndividualRoom, RoomOptions } from '../types';

interface RoomState {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  selectedRoom: { id: number; name: string } | null;
}

const initialState: RoomState = {
  fixedRooms: [],
  bedrooms: [],
  bathrooms: [],
  customRooms: [],
  selectedRoom: null
};

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    updateFixedRooms(state, action: PayloadAction<Room[]>) {
      state.fixedRooms = action.payload;
    },
    updateBedrooms(state, action: PayloadAction<IndividualRoom[]>) {
      state.bedrooms = action.payload;
    },
    updateBathrooms(state, action: PayloadAction<IndividualRoom[]>) {
      state.bathrooms = action.payload;
    },
    updateCustomRooms(state, action: PayloadAction<Room[]>) {
      state.customRooms = action.payload;
    },
    updateRoomOptions(state, action: PayloadAction<{
      roomType: 'fixed' | 'bedroom' | 'bathroom' | 'custom';
      roomId: number;
      options: RoomOptions;
    }>) {
      const { roomType, roomId, options } = action.payload;
      let targetRoom;

      switch (roomType) {
        case 'fixed':
          targetRoom = state.fixedRooms.find(r => r.id === roomId);
          break;
        case 'bedroom':
          targetRoom = state.bedrooms.find(r => r.id === roomId);
          break;
        case 'bathroom':
          targetRoom = state.bathrooms.find(r => r.id === roomId);
          break;
        case 'custom':
          targetRoom = state.customRooms.find(r => r.id === roomId);
          break;
      }

      if (targetRoom) {
        targetRoom.options = options;
        targetRoom.customized = true;
      }
    },
    setSelectedRoom(state, action: PayloadAction<{ id: number; name: string } | null>) {
      state.selectedRoom = action.payload;
    }
  }
});

export const {
  updateFixedRooms,
  updateBedrooms,
  updateBathrooms,
  updateCustomRooms,
  updateRoomOptions,
  setSelectedRoom
} = roomSlice.actions;

export default roomSlice.reducer;