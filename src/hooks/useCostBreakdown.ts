import { useMemo } from 'react';
import { Room, IndividualRoom, OverheadCost, DemoCost } from '../types';
import { useCostCalculator } from './useCostCalculator';

interface MaterialBreakdown {
  name: string;
  cost: number;
  type: string;
}

interface DemoBreakdown {
  room: string;
  total: number;
  hazardous: boolean;
}

interface CostBreakdown {
  materials: Record<string, MaterialBreakdown>;
  totalMaterialCost: number;
  overhead: Record<string, number>;
  demo: Record<string, DemoBreakdown>;
  profitMargin: number;
  contingency: number;
  totalCost: number;
}

export function useCostBreakdown() {
  const { calculateRoomCost } = useCostCalculator();

  const calculateDetailedBreakdown = useMemo(() => (
    rooms: (Room | IndividualRoom)[],
    overheadCosts: OverheadCost[] = [],
    demoCosts: DemoCost[] = []
  ): CostBreakdown => {
    // Calculate material costs for each room
    const materials = rooms.reduce((acc, room) => {
      if (!room.customized) return acc;
      const cost = calculateRoomCost(room);
      return {
        ...acc,
        [room.id]: {
          name: room.name,
          cost,
          type: room.type || 'custom'
        }
      };
    }, {} as Record<string, MaterialBreakdown>);

    // Calculate total material cost
    const totalMaterialCost = Object.values(materials)
      .reduce((sum, { cost }) => sum + cost, 0);

    // Calculate overhead costs
    const overhead = overheadCosts.reduce((acc, cost) => ({
      ...acc,
      [cost.category]: (acc[cost.category] || 0) + cost.amount
    }), {
      total: totalMaterialCost * 0.15 // Default 15% overhead
    } as Record<string, number>);

    // Calculate demo costs by room
    const demo = demoCosts.reduce((acc, cost) => ({
      ...acc,
      [cost.roomId || 'general']: {
        room: cost.roomName,
        total: cost.amount + (cost.laborHours * 75), // $75/hour labor rate
        hazardous: cost.hazardousMaterials
      }
    }), {} as Record<string, DemoBreakdown>);

    // Calculate total cost including overhead and profit margin
    const subtotal = totalMaterialCost + overhead.total + 
      Object.values(demo).reduce((sum, { total }) => sum + total, 0);

    const profitMargin = subtotal * 0.20; // 20% profit margin
    const contingency = subtotal * 0.10; // 10% contingency
    const totalCost = subtotal + profitMargin + contingency;

    return {
      materials,
      totalMaterialCost,
      overhead,
      demo,
      profitMargin,
      contingency,
      totalCost
    };
  }, [calculateRoomCost]);

  return {
    calculateDetailedBreakdown
  };
}