import React, { useState, useMemo } from 'react';
import { ChevronRight, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { Room } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useCostSettings } from '../context/CostSettingsContext';
import { calculateRoomCost } from '../utils/costCalculator';

interface RoomCardProps {
  room: Room;
  onCustomize: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isCustomRoom?: boolean;
}

interface CostBreakdown {
  [key: string]: {
    materialCost: number;
    laborCost: number;
    total: number;
    quantity: number;
    unitPrice: number;
    features?: {
      [key: string]: {
        name: string;
        cost: number;
        quantity: number;
      };
    };
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  onCustomize, 
  onEdit,
  onDelete,
  isCustomRoom 
}) => {
  const { settings, isLoaded } = useCostSettings();
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate costs and breakdown
  const { totalCost, subtotal, overhead, contingency, profitMargin, breakdown } = useMemo(() => {
    if (!room.customized || !room.options || !isLoaded) {
      return { 
        totalCost: 0, 
        subtotal: 0, 
        overhead: 0, 
        contingency: 0, 
        profitMargin: 0, 
        breakdown: {} 
      };
    }

    const costBreakdown: CostBreakdown = {};
    let totalMaterialCost = 0;

    // Calculate each feature's costs
    Object.entries(room.options).forEach(([category, details]) => {
      if (details?.needed && details.type && settings[category]) {
        let quantity = 1;
        let unitPrice = settings[category][details.type] || 0;
        let features = {};

        // Handle special cases for deck, fence, and patio
        if (category === 'deck' && details.features) {
          features = {
            railing: details.features.railing ? {
              name: `${details.features.railing.type} Railing`,
              cost: (settings.deckRailing[details.features.railing.type]?.price || 0) * 
                    details.features.railing.linearFeet,
              quantity: details.features.railing.linearFeet
            } : null,
            stairs: details.features.stairs ? {
              name: `${details.features.stairs.type} Stairs`,
              cost: (settings.deckStairs[details.features.stairs.type]?.price || 0) * 
                    details.features.stairs.count,
              quantity: details.features.stairs.count
            } : null,
            lighting: details.features.lighting ? {
              name: `${details.features.lighting.type} Lighting`,
              cost: (settings.deckLighting[details.features.lighting.type]?.price || 0) * 
                    details.features.lighting.count,
              quantity: details.features.lighting.count
            } : null
          };
        } else if (category === 'fence' && details.features) {
          features = {
            gates: {
              name: 'Gates',
              cost: (
                (details.features.gates.walk * (settings.fenceGates.walk?.price || 0)) +
                (details.features.gates.drive * (settings.fenceGates.drive?.price || 0)) +
                (details.features.gates.automatic * (settings.fenceGates.automatic?.price || 0))
              ),
              quantity: details.features.gates.walk + details.features.gates.drive + 
                       details.features.gates.automatic
            },
            posts: details.features.posts ? {
              name: `${details.features.posts.type} Posts`,
              cost: (settings.fencePosts[details.features.posts.type]?.price || 0) * 
                    details.features.posts.count,
              quantity: details.features.posts.count
            } : null
          };
        } else if (category === 'patio' && details.features) {
          features = {
            border: details.features.border ? {
              name: `${details.features.border.type} Border`,
              cost: (settings.patioBorder[details.features.border.type]?.price || 0) * 
                    details.features.border.linearFeet,
              quantity: details.features.border.linearFeet
            } : null,
            drainage: details.features.drainage ? {
              name: `${details.features.drainage.type} Drainage`,
              cost: (settings.patioDrainage[details.features.drainage.type]?.price || 0) * 
                    details.features.drainage.linearFeet,
              quantity: details.features.drainage.linearFeet
            } : null
          };
        }

        // Get quantity based on measurement type
        if ('squareFeet' in details) {
          quantity = details.squareFeet;
        } else if ('linearFeet' in details) {
          quantity = details.linearFeet;
        } else if ('count' in details) {
          quantity = details.count;
        }

        const materialCost = unitPrice * quantity;
        const laborCost = materialCost * 0.4;
        const total = materialCost + laborCost;

        // Add feature costs to total
        const featureCosts = Object.values(features)
          .filter(Boolean)
          .reduce((sum, feature) => sum + feature.cost, 0);

        if (total > 0 || featureCosts > 0) {
          costBreakdown[category] = {
            materialCost: materialCost + featureCosts,
            laborCost: (materialCost + featureCosts) * 0.4,
            total: total + featureCosts + (featureCosts * 0.4),
            quantity,
            unitPrice,
            features: Object.fromEntries(
              Object.entries(features).filter(([_, value]) => value !== null)
            )
          };
          totalMaterialCost += materialCost + featureCosts;
        }
      }
    });

    // Add custom line items
    if (room.options.customLineItems?.length > 0) {
      const customTotal = room.options.customLineItems.reduce((sum, item) => 
        sum + (item.quantity * item.unitCost), 0);
      
      if (customTotal > 0) {
        costBreakdown.customItems = {
          materialCost: customTotal,
          laborCost: customTotal * 0.4,
          total: customTotal * 1.4,
          quantity: 1,
          unitPrice: customTotal
        };
        totalMaterialCost += customTotal;
      }
    }

    const laborCost = totalMaterialCost * 0.4;
    const subtotal = totalMaterialCost + laborCost;
    const overhead = subtotal * 0.15;
    const contingency = subtotal * 0.10;
    const profitMargin = subtotal * 0.20;
    const totalCost = subtotal + overhead + contingency + profitMargin;

    return {
      totalCost: Math.round(totalCost),
      subtotal: Math.round(subtotal),
      overhead: Math.round(overhead),
      contingency: Math.round(contingency),
      profitMargin: Math.round(profitMargin),
      breakdown: costBreakdown
    };
  }, [room, settings, isLoaded]);

  const formatCategoryName = (name: string) => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <li className="border border-gray-200 rounded-lg mb-3 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {room.name}
            {room.customized && totalCost > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({formatCurrency(totalCost)})
              </span>
            )}
          </h3>
          <div className="mt-1 text-sm text-gray-500 flex flex-col sm:flex-row sm:gap-4">
            <span>{room.customized ? 'Customized' : 'Not customized yet'}</span>
            {room.dimensions && (
              <span className="text-gray-400">
                {room.dimensions.length}' × {room.dimensions.width}' 
                ({room.dimensions.length * room.dimensions.width} sq ft)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isCustomRoom && (
            <>
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete room"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  title="Edit room"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
            </>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCustomize();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {room.customized ? 'Edit' : 'Customize'}
            <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>

      {room.customized && totalCost > 0 && (
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full px-4 py-2 bg-gray-50 flex justify-between items-center hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm font-medium text-gray-700">Cost Breakdown</span>
            {showBreakdown ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          
          {showBreakdown && Object.entries(breakdown).length > 0 && (
            <div className="px-4 py-3 space-y-3">
              {Object.entries(breakdown).map(([category, costs]) => (
                <div key={category} className="text-sm">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{formatCategoryName(category)}</span>
                    <span>{formatCurrency(costs.total)}</span>
                  </div>
                  <div className="mt-1 pl-4 text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Unit Price</span>
                      <span>{formatCurrency(costs.unitPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity</span>
                      <span>{costs.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Materials</span>
                      <span>{formatCurrency(costs.materialCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor</span>
                      <span>{formatCurrency(costs.laborCost)}</span>
                    </div>
                    
                    {/* Show features breakdown if present */}
                    {costs.features && Object.entries(costs.features).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <div className="font-medium text-gray-600 mb-1">Features:</div>
                        {Object.entries(costs.features).map(([featureKey, feature]) => (
                          <div key={featureKey} className="flex justify-between pl-2">
                            <span>{feature.name}</span>
                            <span>{formatCurrency(feature.cost)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Materials & Labor Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Overhead (15%)</span>
                    <span>{formatCurrency(overhead)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contingency (10%)</span>
                    <span>{formatCurrency(contingency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin (20%)</span>
                    <span>{formatCurrency(profitMargin)}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center font-medium text-blue-600">
                  <span>Total Cost</span>
                  <span>{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default RoomCard;