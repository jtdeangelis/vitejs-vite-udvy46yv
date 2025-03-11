import { COSTS } from './costConstants';
import { calculateFeatureCost } from './costCalculator';

// Add missing exports
export const calculateKitchenCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.cabinets?.needed) {
    totalMaterialCost += calculateFeatureCost(options.cabinets, 'cabinets', 'linearFeet', settings);
  }
  if (options.countertops?.needed) {
    totalMaterialCost += calculateFeatureCost(options.countertops, 'countertops', 'squareFeet', settings);
  }
  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.appliances?.needed) {
    totalMaterialCost += calculateFeatureCost(options.appliances, 'appliances', undefined, settings);
  }
  if (options.backsplash?.needed) {
    totalMaterialCost += calculateFeatureCost(options.backsplash, 'backsplash', 'squareFeet', settings);
  }
  if (options.trim?.needed) {
    totalMaterialCost += calculateFeatureCost(options.trim, 'trim', 'linearFeet', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateExteriorCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.siding?.needed) {
    totalMaterialCost += calculateFeatureCost(options.siding, 'siding', 'squareFeet', settings);
  }
  if (options.roof?.needed) {
    totalMaterialCost += calculateFeatureCost(options.roof, 'roof', 'squareFeet', settings);
  }
  if (options.windows?.needed) {
    totalMaterialCost += calculateFeatureCost(options.windows, 'windows', 'count', settings);
  }
  if (options.landscaping?.needed) {
    totalMaterialCost += calculateFeatureCost(options.landscaping, 'landscaping', 'squareFeet', settings);
  }
  if (options.driveway?.needed) {
    totalMaterialCost += calculateFeatureCost(options.driveway, 'driveway', 'squareFeet', settings);
  }
  if (options.hvac?.needed) {
    totalMaterialCost += calculateFeatureCost(options.hvac, 'hvac', undefined, settings);
  }
  if (options.deck?.needed) {
    totalMaterialCost += calculateFeatureCost(options.deck, 'deck', 'squareFeet', settings);
  }
  if (options.patio?.needed) {
    totalMaterialCost += calculateFeatureCost(options.patio, 'patio', 'squareFeet', settings);
  }
  if (options.fence?.needed) {
    totalMaterialCost += calculateFeatureCost(options.fence, 'fence', 'linearFeet', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

// Add other existing calculator functions...
export const calculateBedroomCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.paint?.needed) {
    totalMaterialCost += calculateFeatureCost(options.paint, 'paint', 'squareFeet', settings);
  }
  if (options.closet?.needed) {
    totalMaterialCost += calculateFeatureCost(options.closet, 'closet', 'squareFeet', settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.windows?.needed) {
    totalMaterialCost += calculateFeatureCost(options.windows, 'windows', 'count', settings);
  }
  if (options.trim?.needed) {
    totalMaterialCost += calculateFeatureCost(options.trim, 'trim', 'linearFeet', settings);
  }
  if (options.fan?.needed) {
    totalMaterialCost += calculateFeatureCost(options.fan, 'fan', 'count', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateBathroomCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.vanity?.needed) {
    totalMaterialCost += calculateFeatureCost(options.vanity, 'vanity', 'linearFeet', settings);
  }
  if (options.shower?.needed) {
    totalMaterialCost += calculateFeatureCost(options.shower, 'shower', 'squareFeet', settings);
  }
  if (options.toilet?.needed) {
    totalMaterialCost += calculateFeatureCost(options.toilet, 'toilet', undefined, settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.tile?.needed) {
    totalMaterialCost += calculateFeatureCost(options.tile, 'tile', 'squareFeet', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateLivingRoomCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.paint?.needed) {
    totalMaterialCost += calculateFeatureCost(options.paint, 'paint', 'squareFeet', settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.windows?.needed) {
    totalMaterialCost += calculateFeatureCost(options.windows, 'windows', 'count', settings);
  }
  if (options.trim?.needed) {
    totalMaterialCost += calculateFeatureCost(options.trim, 'trim', 'linearFeet', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateFamilyRoomCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.paint?.needed) {
    totalMaterialCost += calculateFeatureCost(options.paint, 'paint', 'squareFeet', settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.windows?.needed) {
    totalMaterialCost += calculateFeatureCost(options.windows, 'windows', 'count', settings);
  }
  if (options.fireplace?.needed) {
    totalMaterialCost += calculateFeatureCost(options.fireplace, 'fireplace', undefined, settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateDiningRoomCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.paint?.needed) {
    totalMaterialCost += calculateFeatureCost(options.paint, 'paint', 'squareFeet', settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.windows?.needed) {
    totalMaterialCost += calculateFeatureCost(options.windows, 'windows', 'count', settings);
  }
  if (options.builtIns?.needed) {
    totalMaterialCost += calculateFeatureCost(options.builtIns, 'builtIns', 'linearFeet', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateFoyerCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.closet?.needed) {
    totalMaterialCost += calculateFeatureCost(options.closet, 'closet', 'squareFeet', settings);
  }
  if (options.stairs?.needed) {
    totalMaterialCost += calculateFeatureCost(options.stairs, 'stairs', 'linearFeet', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateLaundryRoomCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.cabinets?.needed) {
    totalMaterialCost += calculateFeatureCost(options.cabinets, 'cabinets', 'linearFeet', settings);
  }
  if (options.countertops?.needed) {
    totalMaterialCost += calculateFeatureCost(options.countertops, 'countertops', 'squareFeet', settings);
  }
  if (options.sink?.needed) {
    totalMaterialCost += calculateFeatureCost(options.sink, 'sink', undefined, settings);
  }
  if (options.appliances?.needed) {
    totalMaterialCost += calculateFeatureCost(options.appliances, 'appliances', undefined, settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateGarageCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.storage?.needed) {
    totalMaterialCost += calculateFeatureCost(options.storage, 'storage', 'linearFeet', settings);
  }
  if (options.electrical?.needed) {
    totalMaterialCost += calculateFeatureCost(options.electrical, 'electrical', undefined, settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateHallwayCost = (options: any, settings?: any): number => {
  if (!options) return 0;
  let totalMaterialCost = 0;

  if (options.flooring?.needed) {
    totalMaterialCost += calculateFeatureCost(options.flooring, 'flooring', 'squareFeet', settings);
  }
  if (options.paint?.needed) {
    totalMaterialCost += calculateFeatureCost(options.paint, 'paint', 'squareFeet', settings);
  }
  if (options.lighting?.needed) {
    totalMaterialCost += calculateFeatureCost(options.lighting, 'lighting', 'count', settings);
  }
  if (options.trim?.needed) {
    if (options.trim.types.baseboards.selected) {
      totalMaterialCost += options.trim.types.baseboards.linearFeet * (settings?.trim?.baseboards || COSTS.trim.baseboards);
    }
    if (options.trim.types.crown.selected) {
      totalMaterialCost += options.trim.types.crown.linearFeet * (settings?.trim?.crown || COSTS.trim.crown);
    }
  }

  const laborCost = totalMaterialCost * 0.4;
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};

export const calculateDoorCost = (door: any, settings?: any): number => {
  if (!door?.needed) return 0;

  const doorCosts = settings?.doors?.[door.location] || COSTS.doors[door.location];
  if (!doorCosts) return 0;

  const baseCost = doorCosts[door.type];
  if (!baseCost) return 0;

  // Add cost for wider doors
  const widthMultiplier = door.width > 32 ? 1.2 : 1;
  const materialCost = baseCost * widthMultiplier;

  const laborCost = materialCost * 0.4;
  const subtotal = materialCost + laborCost;
  const overhead = subtotal * 0.15;
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  return Math.round(subtotal + overhead + contingency + profitMargin);
};