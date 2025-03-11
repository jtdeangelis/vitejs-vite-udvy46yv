import { useMemo } from 'react';
import { useCostSettings } from '../context/CostSettingsContext';
import { Room, IndividualRoom } from '../types';
import { calculateKitchenCost, calculateBedroomCost, calculateBathroomCost } from '../utils/costCalculator';

export function useCostCalculator() {
  const { settings } = useCostSettings();

  const calculateRoomCost = useMemo(() => (room: Room | IndividualRoom) => {
    switch (room.type) {
      case 'kitchen':
        return calculateKitchenCost(room.options);
      case 'bedroom':
        return calculateBedroomCost(room.options);
      case 'bathroom':
        return calculateBathroomCost(room.options);
      default:
        return 0;
    }
  }, [settings]);

  const calculateTotalCost = useMemo(() => (
    rooms: (Room | IndividualRoom)[],
    includeOverhead = true,
    includeDemo = true
  ) => {
    const baseCost = rooms.reduce((total, room) => total + calculateRoomCost(room), 0);
    
    if (!includeOverhead && !includeDemo) {
      return baseCost;
    }

    let totalCost = baseCost;

    if (includeOverhead) {
      const overheadPercentage = 0.15; // 15% overhead
      totalCost += baseCost * overheadPercentage;
    }

    if (includeDemo) {
      const demoPercentage = 0.10; // 10% demolition
      totalCost += baseCost * demoPercentage;
    }

    return totalCost;
  }, [calculateRoomCost]);

  const calculateRoomBreakdown = useMemo(() => (room: Room | IndividualRoom) => {
    const cost = calculateRoomCost(room);
    const options = room.options || {};

    const breakdown = {
      materials: {} as Record<string, number>,
      labor: 0,
      overhead: 0,
      total: cost
    };

    // Calculate materials breakdown
    Object.entries(options).forEach(([category, details]) => {
      if (details?.needed && details?.type) {
        const categorySettings = settings[category];
        if (categorySettings) {
          breakdown.materials[category] = categorySettings[details.type] || 0;
        }
      }
    });

    // Calculate labor (40% of materials)
    breakdown.labor = cost * 0.4;

    // Calculate overhead (15% of total)
    breakdown.overhead = cost * 0.15;

    return breakdown;
  }, [calculateRoomCost, settings]);

  return {
    calculateRoomCost,
    calculateTotalCost,
    calculateRoomBreakdown
  };
}