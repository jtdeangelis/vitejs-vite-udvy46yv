import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Room, IndividualRoom } from '../types';
import { calculateRoomCost } from '../utils/costCalculator';
import { getCachedCost, setCachedCost } from '../utils/costCache';
import { validateRoomOptions } from '../utils/costValidation';

interface CostState {
  roomCosts: Record<string, number>;
  lastCalculated: Record<string, number>;
  totalCost: number;
  isCalculating: boolean;
  error: string | null;
}

const initialState: CostState = {
  roomCosts: {},
  lastCalculated: {},
  totalCost: 0,
  isCalculating: false,
  error: null
};

// Async thunk for calculating room cost
export const calculateRoomCostThunk = createAsyncThunk(
  'costs/calculateRoomCost',
  async (room: Room | IndividualRoom, { rejectWithValue }) => {
    try {
      // Skip calculation if room is not customized
      if (!room.customized || !room.options) {
        return { roomId: room.id, cost: 0 };
      }

      // Check cache first
      const cachedCost = getCachedCost(room);
      if (cachedCost !== null) {
        return { roomId: room.id, cost: cachedCost };
      }

      // Validate options
      if (!validateRoomOptions(room.options)) {
        return rejectWithValue(`Invalid options for room: ${room.name}`);
      }

      // Calculate cost
      const cost = calculateRoomCost(room);
      
      // Update cache
      setCachedCost(room, cost);
      
      return { roomId: room.id, cost };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to calculate cost');
    }
  }
);

const costSlice = createSlice({
  name: 'costs',
  initialState,
  reducers: {
    clearCosts(state) {
      state.roomCosts = {};
      state.lastCalculated = {};
      state.totalCost = 0;
      state.error = null;
    },
    updateRoomCost(state, action) {
      const { roomId, cost } = action.payload;
      state.roomCosts[roomId] = cost;
      state.lastCalculated[roomId] = Date.now();
      state.totalCost = Object.values(state.roomCosts).reduce((sum, cost) => sum + cost, 0);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(calculateRoomCostThunk.pending, (state) => {
        state.isCalculating = true;
        state.error = null;
      })
      .addCase(calculateRoomCostThunk.fulfilled, (state, action) => {
        const { roomId, cost } = action.payload;
        state.roomCosts[roomId] = cost;
        state.lastCalculated[roomId] = Date.now();
        state.totalCost = Object.values(state.roomCosts).reduce((sum, cost) => sum + cost, 0);
        state.isCalculating = false;
      })
      .addCase(calculateRoomCostThunk.rejected, (state, action) => {
        state.isCalculating = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCosts, updateRoomCost } = costSlice.actions;
export default costSlice.reducer;