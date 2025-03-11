import { COSTS } from './costConstants';

export interface MaterialDetails {
  price: number;
  installTime: number;
  leadTime: number;
  specialHandling?: boolean;
  alternativeOptions?: string[];
  supplierInfo?: {
    name: string;
    rating?: number;
    minOrder?: number;
  };
}

export const getMaterialDetails = (
  category: string,
  type: string,
  subtype?: string
): MaterialDetails | null => {
  try {
    const categoryData = COSTS[category];
    if (!categoryData) return null;

    let materialData;
    if (subtype) {
      materialData = categoryData[type]?.[subtype];
    } else {
      materialData = categoryData[type];
    }

    if (!materialData) return null;

    // Get alternative options
    const alternatives = Object.keys(categoryData)
      .filter(t => t !== type)
      .slice(0, 3);

    // Determine if special handling is needed
    const specialHandlingItems = {
      countertops: ['marble', 'granite'],
      appliances: ['refrigerator', 'range'],
      cabinets: ['custom'],
      flooring: ['hardwood', 'marble']
    };

    const needsSpecialHandling = specialHandlingItems[category]?.includes(type) || false;

    // Get supplier info
    const supplierInfo = {
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Supply Co`,
      rating: 4.5,
      minOrder: materialData.price * 10
    };

    return {
      ...materialData,
      specialHandling: needsSpecialHandling,
      alternativeOptions: alternatives,
      supplierInfo
    };
  } catch (error) {
    console.error('Error getting material details:', error);
    return null;
  }
};

export const calculateInstallTime = (
  category: string,
  type: string,
  quantity: number
): number => {
  const details = getMaterialDetails(category, type);
  if (!details) return 0;
  return details.installTime * quantity;
};

export const calculateLeadTime = (
  category: string,
  type: string,
  quantity: number
): number => {
  const details = getMaterialDetails(category, type);
  if (!details) return 7; // Default 7 days
  return Math.ceil(details.leadTime * (1 + (quantity / 100))); // Increase lead time for large orders
};

export const formatInstallTime = (hours: number): string => {
  if (hours < 24) {
    return `${Math.ceil(hours)} hours`;
  }
  return `${Math.ceil(hours / 8)} days`;
};

export const getSupplierRecommendations = (
  category: string,
  type: string,
  budget: number
): { name: string; price: number; rating: number }[] => {
  // This would typically come from an API or database
  // Simulated data for demonstration
  return [
    {
      name: "Premium Supplies Co",
      price: budget * 1.2,
      rating: 4.8
    },
    {
      name: "Value Materials Inc",
      price: budget * 0.9,
      rating: 4.2
    },
    {
      name: "Local Supply House",
      price: budget,
      rating: 4.5
    }
  ];
};