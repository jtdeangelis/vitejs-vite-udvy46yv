import { COSTS } from './costConstants';
import { Room, IndividualRoom, CustomLineItem } from '../types';

// Helper function to calculate feature costs
export const calculateFeatureCost = (
  feature: { needed: boolean; type: string; [key: string]: any },
  costCategory: keyof typeof COSTS,
  quantityField?: string,
  settings?: any
): number => {
  if (!feature?.needed) return 0;

  // Use provided settings or fallback to default COSTS
  const costs = settings?.[costCategory] || COSTS[costCategory];
  if (!costs) return 0;

  // Get base cost based on type
  const baseCost = costs[feature.type];
  if (!baseCost) return 0;

  // Get quantity based on measurement type
  let quantity = 1;
  if (quantityField && feature[quantityField]) {
    quantity = feature[quantityField];
  }

  return baseCost * quantity;
};

// Calculate custom line items total
const calculateCustomLineItemsCost = (items?: CustomLineItem[]): number => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    if (!item || typeof item.quantity !== 'number' || typeof item.unitCost !== 'number') {
      return sum;
    }
    return sum + (item.quantity * item.unitCost);
  }, 0);
};

// Generic room cost calculation function
export const calculateRoomCost = (room: Room | IndividualRoom): number => {
  if (!room?.options || !room.customized) return 0;

  let totalMaterialCost = 0;

  // Calculate material costs for each feature
  Object.entries(room.options).forEach(([category, details]) => {
    if (details?.needed && details.type && category !== 'customLineItems' && category !== 'notes') {
      const featureCost = calculateFeatureCost(details, category as keyof typeof COSTS, 
        'squareFeet' in details ? 'squareFeet' : 
        'linearFeet' in details ? 'linearFeet' : 
        'count' in details ? 'count' : undefined
      );
      totalMaterialCost += featureCost;
    }
  });

  // Add custom line item costs if present
  const customItemsCost = calculateCustomLineItemsCost(room.options.customLineItems);
  totalMaterialCost += customItemsCost;

  // Calculate labor cost (40% of materials)
  const laborCost = totalMaterialCost * 0.4;

  // Calculate overhead (15% of subtotal)
  const subtotal = totalMaterialCost + laborCost;
  const overhead = subtotal * 0.15;

  // Calculate contingency (10% of subtotal)
  const contingency = subtotal * 0.10;

  // Calculate profit margin (20% of subtotal)
  const profitMargin = subtotal * 0.20;

  // Return total cost
  return Math.round(subtotal + overhead + contingency + profitMargin);
};

// Export all the room cost calculation functions
export * from './roomCostCalculators';