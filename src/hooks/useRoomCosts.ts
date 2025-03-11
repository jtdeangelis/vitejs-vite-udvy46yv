import { useCallback } from 'react';
import { Room, IndividualRoom } from '../types';
import { useCostSettings } from '../context/CostSettingsContext';
import { 
  calculateKitchenCost,
  calculateBedroomCost,
  calculateBathroomCost,
  calculateLivingRoomCost,
  calculateFamilyRoomCost,
  calculateDiningRoomCost,
  calculateFoyerCost,
  calculateLaundryRoomCost,
  calculateGarageCost,
  calculateExteriorCost,
  calculateHallwayCost,
  calculateDoorCost
} from '../utils/costCalculator';

export const useRoomCosts = (state?: any) => {
  const { settings } = useCostSettings();

  // Calculate fixed rooms costs
  const calculateFixedRoomsCost = useCallback(() => {
    if (!state) return [];

    const kitchenCost = calculateKitchenCost(state.kitchenOptions, settings);
    const livingRoomCost = calculateLivingRoomCost(state.livingRoomOptions, settings);
    const familyRoomCost = calculateFamilyRoomCost(state.familyRoomOptions, settings);
    const diningRoomCost = calculateDiningRoomCost(state.diningRoomOptions, settings);
    const foyerCost = calculateFoyerCost(state.foyerOptions, settings);
    const laundryCost = calculateLaundryRoomCost(state.laundryRoomOptions, settings);
    const garageCost = calculateGarageCost(state.garageOptions, settings);
    const exteriorCost = calculateExteriorCost(state.exteriorOptions, settings);
    const hallwayCost = calculateHallwayCost(state.hallwayOptions, settings);

    return [
      { id: 1, name: 'Kitchen', cost: kitchenCost, customized: isRoomCustomized(state.kitchenOptions), options: state.kitchenOptions },
      { id: 2, name: 'Living Room', cost: livingRoomCost, customized: isRoomCustomized(state.livingRoomOptions), options: state.livingRoomOptions },
      { id: 3, name: 'Family Room', cost: familyRoomCost, customized: isRoomCustomized(state.familyRoomOptions), options: state.familyRoomOptions },
      { id: 4, name: 'Dining Room', cost: diningRoomCost, customized: isRoomCustomized(state.diningRoomOptions), options: state.diningRoomOptions },
      { id: 5, name: 'Foyer', cost: foyerCost, customized: isRoomCustomized(state.foyerOptions), options: state.foyerOptions },
      { id: 6, name: 'Laundry Room', cost: laundryCost, customized: isRoomCustomized(state.laundryRoomOptions), options: state.laundryRoomOptions },
      { id: 7, name: 'Garage', cost: garageCost, customized: isRoomCustomized(state.garageOptions), options: state.garageOptions },
      { id: 8, name: 'Exterior', cost: exteriorCost, customized: isRoomCustomized(state.exteriorOptions), options: state.exteriorOptions },
      { id: 9, name: 'Hallway', cost: hallwayCost, customized: isRoomCustomized(state.hallwayOptions), options: state.hallwayOptions }
    ];
  }, [state, settings]);

  // Calculate bedroom costs
  const calculateBedroomsCost = useCallback((bedrooms: IndividualRoom[]) => {
    if (!bedrooms || !Array.isArray(bedrooms)) return [];
    return bedrooms.map(bedroom => {
      const bedroomOption = state?.bedroomOptionsMap?.[bedroom.id];
      if (!bedroomOption) return bedroom;

      const cost = calculateBedroomCost(bedroomOption, settings);
      const customized = isRoomCustomized(bedroomOption);

      return {
        ...bedroom,
        cost,
        customized,
        dimensions: bedroomOption.dimensions,
        options: bedroomOption
      };
    });
  }, [state?.bedroomOptionsMap, settings]);

  // Calculate bathroom costs
  const calculateBathroomsCost = useCallback((bathrooms: IndividualRoom[]) => {
    if (!bathrooms || !Array.isArray(bathrooms)) return [];
    return bathrooms.map(bathroom => {
      const bathroomOption = state?.bathroomOptionsMap?.[bathroom.id];
      if (!bathroomOption) return bathroom;

      const cost = calculateBathroomCost(bathroomOption, settings);
      const customized = isRoomCustomized(bathroomOption);

      return {
        ...bathroom,
        cost,
        customized,
        dimensions: bathroomOption.dimensions,
        options: bathroomOption
      };
    });
  }, [state?.bathroomOptionsMap, settings]);

  // Calculate total cost
  const calculateTotalCost = useCallback(() => {
    const fixedRoomsCost = calculateFixedRoomsCost().reduce((sum, room) => sum + room.cost, 0);
    const bedroomsCost = calculateBedroomsCost(state?.bedrooms || []).reduce((sum, room) => sum + room.cost, 0);
    const bathroomsCost = calculateBathroomsCost(state?.bathrooms || []).reduce((sum, room) => sum + room.cost, 0);
    const customRoomsCost = (state?.customRooms || []).reduce((sum, room) => sum + room.cost, 0);
    
    return fixedRoomsCost + bedroomsCost + bathroomsCost + customRoomsCost;
  }, [state, calculateFixedRoomsCost, calculateBedroomsCost, calculateBathroomsCost]);

  return {
    calculateFixedRoomsCost,
    calculateBedroomsCost,
    calculateBathroomsCost,
    calculateTotalCost
  };
};

// Helper function to check if a room is customized
const isRoomCustomized = (options: any): boolean => {
  if (!options) return false;
  
  // Check if any feature is needed
  return Object.entries(options).some(([key, value]) => {
    if (key === 'customLineItems') {
      return Array.isArray(value) && value.length > 0;
    }
    if (key === 'notes') {
      return typeof value === 'string' && value.trim().length > 0;
    }
    if (key === 'dimensions') {
      return false; // Dimensions alone don't count as customization
    }
    return value?.needed === true;
  });
};