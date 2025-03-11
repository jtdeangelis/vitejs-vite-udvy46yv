import { useMemo } from 'react';
import { Room, IndividualRoom } from '../types';

export function useMemoizedCalculations(
  fixedRooms: Room[],
  bedrooms: IndividualRoom[],
  bathrooms: IndividualRoom[],
  customRooms: Room[]
) {
  const totalCost = useMemo(() => {
    const fixedRoomsCost = fixedRooms.reduce((sum, room) => sum + room.cost, 0);
    const bedroomsCost = bedrooms.reduce((sum, room) => sum + room.cost, 0);
    const bathroomsCost = bathrooms.reduce((sum, room) => sum + room.cost, 0);
    const customRoomsCost = customRooms.reduce((sum, room) => sum + room.cost, 0);
    
    return fixedRoomsCost + bedroomsCost + bathroomsCost + customRoomsCost;
  }, [fixedRooms, bedrooms, bathrooms, customRooms]);

  const sectionCosts = useMemo(() => ({
    fixedRoomsCost: fixedRooms.reduce((sum, room) => sum + room.cost, 0),
    bedroomsCost: bedrooms.reduce((sum, room) => sum + room.cost, 0),
    bathroomsCost: bathrooms.reduce((sum, room) => sum + room.cost, 0),
    customRoomsCost: customRooms.reduce((sum, room) => sum + room.cost, 0)
  }), [fixedRooms, bedrooms, bathrooms, customRooms]);

  const roomStats = useMemo(() => ({
    totalRooms: fixedRooms.length + bedrooms.length + bathrooms.length + customRooms.length,
    customizedRooms: [
      ...fixedRooms,
      ...bedrooms,
      ...bathrooms,
      ...customRooms
    ].filter(room => room.customized).length,
    averageCostPerRoom: totalCost / (fixedRooms.length + bedrooms.length + bathrooms.length + customRooms.length)
  }), [fixedRooms, bedrooms, bathrooms, customRooms, totalCost]);

  return { totalCost, sectionCosts, roomStats };
}