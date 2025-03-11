import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';
import { Room, IndividualRoom } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Clock, Building, FileText, PenTool as Tool, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { useCostSettings } from '../context/CostSettingsContext';
import { calculateRoomCost } from '../utils/costCalculator';
import { useAppDispatch, useAppSelector } from '../hooks';
import { calculateRoomCostThunk } from '../store/costSlice';

interface CostBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
}

const CostBreakdownModal: React.FC<CostBreakdownModalProps> = ({
  isOpen,
  onClose,
  rooms,
  bedrooms,
  bathrooms,
  customRooms,
  totalCost
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'overhead'>('overview');
  const [projectDuration, setProjectDuration] = useState(90); // Default 90 days
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);
  const { settings } = useCostSettings();
  const dispatch = useAppDispatch();
  const roomCosts = useAppSelector(state => state.costs.roomCosts);

  // Reset expanded rooms when modal opens
  useEffect(() => {
    if (isOpen) {
      setExpandedRooms([]);
      // Calculate costs for all rooms
      const allRooms = [...rooms, ...bedrooms, ...bathrooms, ...customRooms];
      allRooms.forEach(room => {
        if (room.customized) {
          dispatch(calculateRoomCostThunk(room));
        }
      });
    }
  }, [isOpen, dispatch, rooms, bedrooms, bathrooms, customRooms]);

  // Calculate cost breakdown for each room
  const roomBreakdowns = useMemo(() => {
    const breakdowns: Record<string, {
      materials: Record<string, { cost: number; quantity: number; unitPrice: number }>;
      labor: number;
      overhead: number;
      contingency: number;
      profitMargin: number;
      total: number;
    }> = {};

    const allRooms = [...rooms, ...bedrooms, ...bathrooms, ...customRooms];

    allRooms.forEach(room => {
      if (!room.customized || !room.options) return;

      let totalMaterialCost = 0;
      const materials: Record<string, { cost: number; quantity: number; unitPrice: number }> = {};

      // Calculate material costs
      Object.entries(room.options).forEach(([category, details]) => {
        if (details?.needed && details.type && settings[category]) {
          let quantity = 1;
          const unitPrice = settings[category][details.type] || 0;

          if ('squareFeet' in details) {
            quantity = details.squareFeet;
          } else if ('linearFeet' in details) {
            quantity = details.linearFeet;
          } else if ('count' in details) {
            quantity = details.count;
          }

          const cost = unitPrice * quantity;
          if (cost > 0) {
            materials[category] = { cost, quantity, unitPrice };
            totalMaterialCost += cost;
          }
        }
      });

      // Add custom line items
      if (room.options.customLineItems?.length > 0) {
        const customTotal = room.options.customLineItems.reduce((sum, item) => 
          sum + (item.quantity * item.unitCost), 0);
        
        if (customTotal > 0) {
          materials.customItems = {
            cost: customTotal,
            quantity: 1,
            unitPrice: customTotal
          };
          totalMaterialCost += customTotal;
        }
      }

      const labor = totalMaterialCost * 0.4;
      const subtotal = totalMaterialCost + labor;
      const overhead = subtotal * 0.15;
      const contingency = subtotal * 0.10;
      const profitMargin = subtotal * 0.20;
      const total = subtotal + overhead + contingency + profitMargin;

      breakdowns[room.name] = {
        materials,
        labor,
        overhead,
        contingency,
        profitMargin,
        total
      };
    });

    return breakdowns;
  }, [rooms, bedrooms, bathrooms, customRooms, settings]);

  const toggleRoomExpansion = (roomName: string) => {
    setExpandedRooms(prev => 
      prev.includes(roomName) 
        ? prev.filter(name => name !== roomName)
        : [...prev, roomName]
    );
  };

  const formatCategoryName = (name: string) => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content cost-breakdown-modal"
      overlayClassName="modal-overlay"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Cost Breakdown</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            {['overview', 'overhead'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  {/* Room Sections */}
                  {[
                    { title: 'Common Areas', rooms: rooms },
                    { title: 'Bedrooms', rooms: bedrooms },
                    { title: 'Bathrooms', rooms: bathrooms },
                    { title: 'Custom Rooms', rooms: customRooms }
                  ].map(({ title, rooms }) => {
                    const customizedRooms = rooms.filter(room => room.customized);
                    if (customizedRooms.length === 0) return null;

                    return (
                      <div key={title} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-900">{title}</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {customizedRooms.map(room => {
                            const breakdown = roomBreakdowns[room.name];
                            if (!breakdown) return null;

                            return (
                              <div key={room.name} className="cost-breakdown-item">
                                <button
                                  onClick={() => toggleRoomExpansion(room.name)}
                                  className="w-full flex items-center justify-between py-2"
                                >
                                  <span className="font-medium text-gray-900">{room.name}</span>
                                  <div className="flex items-center">
                                    <span className="mr-2 text-blue-600">
                                      {formatCurrency(breakdown.total)}
                                    </span>
                                    {expandedRooms.includes(room.name) ? (
                                      <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                </button>

                                <AnimatePresence>
                                  {expandedRooms.includes(room.name) && (
                                    <motion.div
                                      initial={{ height: 0 }}
                                      animate={{ height: 'auto' }}
                                      exit={{ height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="py-3 px-4 bg-gray-50 rounded-lg mt-2">
                                        {Object.entries(breakdown.materials).map(([category, { cost, quantity, unitPrice }]) => (
                                          <div key={category} className="mb-3">
                                            <div className="flex justify-between text-sm font-medium text-gray-900">
                                              <span>{formatCategoryName(category)}</span>
                                              <span>{formatCurrency(cost)}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-gray-500 space-y-1">
                                              <div className="flex justify-between">
                                                <span>Unit Price</span>
                                                <span>{formatCurrency(unitPrice)}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span>Quantity</span>
                                                <span>{quantity}</span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                        <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Labor (40%)</span>
                                            <span>{formatCurrency(breakdown.labor)}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Overhead (15%)</span>
                                            <span>{formatCurrency(breakdown.overhead)}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Contingency (10%)</span>
                                            <span>{formatCurrency(breakdown.contingency)}</span>
                                          </div>
                                          <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Profit (20%)</span>
                                            <span>{formatCurrency(breakdown.profitMargin)}</span>
                                          </div>
                                          <div className="pt-2 border-t border-gray-200 flex justify-between font-medium">
                                            <span>Total</span>
                                            <span className="text-blue-600">{formatCurrency(breakdown.total)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Project Totals */}
                  <div className="bg-gray-900 text-white rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Project Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Materials & Labor</span>
                        <span>{formatCurrency(totalCost * 0.7)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Overhead (15%)</span>
                        <span>{formatCurrency(totalCost * 0.15)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Contingency (10%)</span>
                        <span>{formatCurrency(totalCost * 0.10)}</span>
                      </div>
                      <div className="flex justify-between text-gray-300">
                        <span>Profit Margin (20%)</span>
                        <span>{formatCurrency(totalCost * 0.20)}</span>
                      </div>
                      <div className="pt-3 border-t border-gray-600">
                        <div className="flex justify-between text-lg font-medium">
                          <span>Total Project Cost</span>
                          <span>{formatCurrency(totalCost)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Project Duration */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-medium text-gray-900">Project Duration</h3>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Duration (days)
                      </label>
                      <input
                        type="number"
                        value={projectDuration}
                        onChange={(e) => setProjectDuration(Math.max(1, parseInt(e.target.value) || 0))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  {/* Overhead Categories */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Building className="h-5 w-5 text-blue-500" />
                      <h3 className="text-lg font-medium text-gray-900">Overhead Categories</h3>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          title: 'Project Management (5%)',
                          description: 'Supervision, coordination, and administrative costs',
                          amount: totalCost * 0.05
                        },
                        {
                          title: 'Permits & Inspections (3%)',
                          description: 'Building permits, inspections, and compliance costs',
                          amount: totalCost * 0.03
                        },
                        {
                          title: 'Insurance & Bonds (2%)',
                          description: 'Liability insurance, workers comp, and performance bonds',
                          amount: totalCost * 0.02
                        },
                        {
                          title: 'Equipment & Tools (3%)',
                          description: 'Rental equipment, specialized tools, and temporary facilities',
                          amount: totalCost * 0.03
                        },
                        {
                          title: 'Miscellaneous (2%)',
                          description: 'Cleanup, waste removal, temporary utilities, and other indirect costs',
                          amount: totalCost * 0.02
                        }
                      ].map((category, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{category.title}</h4>
                              <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                            </div>
                            <span className="text-blue-600 font-medium">
                              {formatCurrency(category.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
};

export default CostBreakdownModal;