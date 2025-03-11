import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Room, IndividualRoom } from '../types';

interface CostBreakdown {
  materials: number;
  labor: number;
  overhead: number;
  contingency: number;
  profitMargin: number;
  total: number;
}

interface RoomCosts {
  [roomId: number]: {
    materials: { [category: string]: number };
    labor: number;
    total: number;
  };
}

interface CostState {
  roomCosts: RoomCosts;
  totalBreakdown: CostBreakdown;
}

type CostAction = 
  | { type: 'UPDATE_ROOM_COST'; payload: { roomId: number; costs: { materials: { [category: string]: number }; labor: number } } }
  | { type: 'RECALCULATE_TOTALS' }
  | { type: 'RESET_COSTS' };

const initialState: CostState = {
  roomCosts: {},
  totalBreakdown: {
    materials: 0,
    labor: 0,
    overhead: 0,
    contingency: 0,
    profitMargin: 0,
    total: 0
  }
};

const CostContext = createContext<{
  state: CostState;
  dispatch: React.Dispatch<CostAction>;
} | undefined>(undefined);

function costReducer(state: CostState, action: CostAction): CostState {
  switch (action.type) {
    case 'UPDATE_ROOM_COST': {
      const { roomId, costs } = action.payload;
      const roomTotal = Object.values(costs.materials).reduce((sum, cost) => sum + cost, 0) + costs.labor;
      
      const newRoomCosts = {
        ...state.roomCosts,
        [roomId]: {
          materials: costs.materials,
          labor: costs.labor,
          total: roomTotal
        }
      };

      // Calculate new totals
      const materialsCost = Object.values(newRoomCosts).reduce(
        (sum, room) => sum + Object.values(room.materials).reduce((a, b) => a + b, 0),
        0
      );
      const laborCost = Object.values(newRoomCosts).reduce(
        (sum, room) => sum + room.labor,
        0
      );
      const subtotal = materialsCost + laborCost;
      const overhead = subtotal * 0.15;
      const contingency = subtotal * 0.10;
      const profitMargin = subtotal * 0.20;
      const total = subtotal + overhead + contingency + profitMargin;

      return {
        roomCosts: newRoomCosts,
        totalBreakdown: {
          materials: materialsCost,
          labor: laborCost,
          overhead,
          contingency,
          profitMargin,
          total
        }
      };
    }

    case 'RECALCULATE_TOTALS': {
      const materialsCost = Object.values(state.roomCosts).reduce(
        (sum, room) => sum + Object.values(room.materials).reduce((a, b) => a + b, 0),
        0
      );
      const laborCost = Object.values(state.roomCosts).reduce(
        (sum, room) => sum + room.labor,
        0
      );
      const subtotal = materialsCost + laborCost;
      const overhead = subtotal * 0.15;
      const contingency = subtotal * 0.10;
      const profitMargin = subtotal * 0.20;
      const total = subtotal + overhead + contingency + profitMargin;

      return {
        ...state,
        totalBreakdown: {
          materials: materialsCost,
          labor: laborCost,
          overhead,
          contingency,
          profitMargin,
          total
        }
      };
    }

    case 'RESET_COSTS':
      return initialState;

    default:
      return state;
  }
}

export const CostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(costReducer, initialState);

  return (
    <CostContext.Provider value={{ state, dispatch }}>
      {children}
    </CostContext.Provider>
  );
};

export const useCosts = () => {
  const context = useContext(CostContext);
  if (!context) {
    throw new Error('useCosts must be used within a CostProvider');
  }
  return context;
};