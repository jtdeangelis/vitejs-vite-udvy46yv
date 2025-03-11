import { useMemo } from 'react';
import { Room, IndividualRoom } from '../types';
import { useCostSettings } from '../context/CostSettingsContext';
import { calculateRoomCost } from '../utils/costCalculator';

export const useRoomCost = (room: Room | IndividualRoom): number => {
  const { settings } = useCostSettings();

  return useMemo(() => {
    if (!room.customized) return 0;
    return calculateRoomCost(room);
  }, [room, settings]);
};