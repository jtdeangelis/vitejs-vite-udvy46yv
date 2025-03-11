import React, { useEffect, useState } from 'react';
import { ChevronRight, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { IndividualRoom } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useCostSettings } from '../context/CostSettingsContext';
import { calculateRoomCost } from '../utils/costCalculator';

interface IndividualRoomCardProps {
  room: IndividualRoom;
  onCustomize: () => void;
  onDelete: () => void;
}

interface CostBreakdown {
  [key: string]: {
    materialCost: number;
    laborCost: number;
    total: number;
  };
}

const IndividualRoomCard: React.FC<IndividualRoomCardProps> = ({ 
  room, 
  onCustomize, 
  onDelete 
}) => {
  const { settings } = useCostSettings();
  const [roomCost, setRoomCost] = useState(room.cost);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown>({});

  // Calculate detailed cost breakdown for each feature
  const calculateBreakdown = () => {
    if (!room.options) return {};
    
    const breakdown: CostBreakdown = {};
    
    Object.entries(room.options).forEach(([category, details]) => {
      if (details?.needed && details.type && settings[category]) {
        let quantity = 1;
        let baseCost = settings[category][details.type] || 0;

        // Handle quantity-based costs
        if ('squareFeet' in details) {
          quantity = details.squareFeet;
        } else if ('linearFeet' in details) {
          quantity = details.linearFeet;
        } else if ('count' in details) {
          quantity = details.count;
        }

        const materialCost = baseCost * quantity;
        const laborCost = materialCost * 0.4; // 40% labor cost
        const total = materialCost + laborCost;

        if (total > 0) {
          breakdown[category] = {
            materialCost,
            laborCost,
            total
          };
        }
      }
    });

    // Add custom line items if any
    if (room.options?.customLineItems?.length > 0) {
      const customTotal = room.options.customLineItems.reduce((sum, item) => 
        sum + (item.quantity * item.unitCost), 0);
      
      if (customTotal > 0) {
        breakdown.customItems = {
          materialCost: customTotal,
          laborCost: customTotal * 0.4,
          total: customTotal * 1.4
        };
      }
    }

    return breakdown;
  };

  // Recalculate cost when settings or room options change
  useEffect(() => {
    if (room.customized && room.options) {
      const newCost = calculateRoomCost(room);
      setRoomCost(newCost);
      setCostBreakdown(calculateBreakdown());
    } else {
      setRoomCost(0);
      setCostBreakdown({});
    }
  }, [room, settings]);

  const formatCategoryName = (name: string) => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <li className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {room.name}
            {room.customized && roomCost > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({formatCurrency(roomCost)})
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
          <button
            onClick={onDelete}
            className="p-2 text-red-500 hover:text-red-700 focus:outline-none"
            title="Delete room"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={onCustomize}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {room.customized ? 'Edit' : 'Customize'}
            <ChevronRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
      {room.customized && roomCost > 0 && (
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
          
          {showBreakdown && Object.entries(costBreakdown).length > 0 && (
            <div className="px-4 py-3 space-y-3">
              {Object.entries(costBreakdown).map(([category, costs]) => (
                <div key={category} className="text-sm">
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{formatCategoryName(category)}</span>
                    <span>{formatCurrency(costs.total)}</span>
                  </div>
                  <div className="mt-1 pl-4 text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Materials</span>
                      <span>{formatCurrency(costs.materialCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor</span>
                      <span>{formatCurrency(costs.laborCost)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Subtotal</span>
                  <span>{formatCurrency(roomCost * 0.7)}</span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Overhead (15%)</span>
                    <span>{formatCurrency(roomCost * 0.15)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contingency (10%)</span>
                    <span>{formatCurrency(roomCost * 0.10)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit Margin (20%)</span>
                    <span>{formatCurrency(roomCost * 0.20)}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center font-medium text-blue-600">
                  <span>Total Cost</span>
                  <span>{formatCurrency(roomCost)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default IndividualRoomCard;