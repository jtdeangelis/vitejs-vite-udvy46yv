import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Layout, Clock, Lightbulb, DollarSign, Calculator, Package, ChevronRight } from 'lucide-react';
import PropertyDetailsSection from './PropertyDetailsSection';
import CommonAreasSection from './sections/CommonAreasSection';
import BedroomsSection from './sections/BedroomsSection';
import BathroomsSection from './sections/BathroomsSection';
import CustomRoomsSection from './CustomRoomsSection';
import DoorManagementSection from './DoorManagementSection';
import DemoSection from './DemoSection';
import ProjectTimeline from './ProjectTimeline';
import RecommendationEngine from './RecommendationEngine';
import ROICalculator from './ROICalculator';
import CostGuideTab from './CostGuideTab';
import CostTotalsTab from './CostTotalsTab';
import MaterialsTab from './MaterialsTab';
import { useRoomCosts } from '../hooks/useRoomCosts';
import { useProject } from '../context/ProjectContext';
import ProjectOutline from './ProjectOutline';

interface TabContainerProps {
  propertyDetails: any;
  setPropertyDetails: (details: any) => void;
  fixedRooms: any[];
  bedrooms: any[];
  bathrooms: any[];
  customRooms: any[];
  doors: any[];
  onCustomizeRoom: (roomName: string) => void;
  onAddBedroom: (name: string) => void;
  onDeleteBedroom: (id: number) => void;
  onCustomizeBedroom: (id: number, name: string) => void;
  onAddBathroom: (name: string) => void;
  onDeleteBathroom: (id: number) => void;
  onCustomizeBathroom: (id: number, name: string) => void;
  onAddCustomRoom: (name: string, options: any) => void;
  onEditCustomRoom: (id: number, name: string, options: any) => void;
  onDeleteCustomRoom: (id: number) => void;
  onCustomizeCustomRoom: (id: number) => void;
  onAddDoor: (door: any) => void;
  onUpdateDoor: (id: number, updates: any) => void;
  onDeleteDoor: (id: number) => void;
  totalCost: number;
  projectId?: string;
}

const tabs = [
  {
    id: 'property',
    label: 'Property Details',
    icon: Home,
    color: {
      bg: 'bg-blue-50',
      hover: 'hover:bg-blue-50/50',
      text: 'text-blue-600',
      border: 'border-blue-500'
    },
    badge: (state: any) => state.propertyDetails.address ? '✓' : null
  },
  {
    id: 'rooms',
    label: 'Rooms',
    icon: Layout,
    color: {
      bg: 'bg-green-50',
      hover: 'hover:bg-green-50/50', 
      text: 'text-green-600',
      border: 'border-green-500'
    },
    badge: (state: any) => {
      const customizedCount = [...state.fixedRooms, ...state.bedrooms, ...state.bathrooms, ...state.customRooms]
        .filter(room => room.customized).length;
      const totalRooms = state.fixedRooms.length + state.bedrooms.length + state.bathrooms.length + state.customRooms.length;
      return `${customizedCount}/${totalRooms}`;
    }
  },
  {
    id: 'materials',
    label: 'Materials',
    icon: Package,
    color: {
      bg: 'bg-orange-50',
      hover: 'hover:bg-orange-50/50',
      text: 'text-orange-600',
      border: 'border-orange-500'
    }
  },
  {
    id: 'timeline',
    label: 'Timeline',
    icon: Clock,
    color: {
      bg: 'bg-purple-50',
      hover: 'hover:bg-purple-50/50',
      text: 'text-purple-600',
      border: 'border-purple-500'
    }
  },
  {
    id: 'recommendations',
    label: 'Recommendations',
    icon: Lightbulb,
    color: {
      bg: 'bg-amber-50',
      hover: 'hover:bg-amber-50/50',
      text: 'text-amber-600',
      border: 'border-amber-500'
    },
    badge: (state: any) => {
      const customizedRooms = [...state.fixedRooms, ...state.bedrooms, ...state.bathrooms, ...state.customRooms]
        .filter(room => room.customized).length;
      return customizedRooms > 0 ? '✨' : null;
    }
  },
  {
    id: 'costs',
    label: 'Cost Totals',
    icon: DollarSign,
    color: {
      bg: 'bg-emerald-50',
      hover: 'hover:bg-emerald-50/50',
      text: 'text-emerald-600',
      border: 'border-emerald-500'
    },
    badge: (_state: any, totalCost: number) => totalCost > 0 ? `$${Math.round(totalCost / 1000)}k` : null
  },
  {
    id: 'guide',
    label: 'Cost Guide',
    icon: Calculator,
    color: {
      bg: 'bg-indigo-50',
      hover: 'hover:bg-indigo-50/50',
      text: 'text-indigo-600',
      border: 'border-indigo-500'
    }
  }
];

const TabContainer: React.FC<TabContainerProps> = ({
  propertyDetails,
  setPropertyDetails,
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms,
  doors,
  onCustomizeRoom,
  onAddBedroom,
  onDeleteBedroom,
  onCustomizeBedroom,
  onAddBathroom,
  onDeleteBathroom,
  onCustomizeBathroom,
  onAddCustomRoom,
  onEditCustomRoom,
  onDeleteCustomRoom,
  onCustomizeCustomRoom,
  onAddDoor,
  onUpdateDoor,
  onDeleteDoor,
  totalCost,
  projectId
}) => {
  const [activeTab, setActiveTab] = useState('property');
  const [demoItems, setDemoItems] = useState<Array<{
    id: number;
    roomName: string;
    description: string;
    cost: number;
    laborHours: number;
    notes: string;
  }>>([]);

  const { state } = useProject();
  const { 
    calculateFixedRoomsCost,
    calculateBedroomsCost,
    calculateBathroomsCost
  } = useRoomCosts(state);

  // Calculate updated room costs
  const updatedFixedRooms = calculateFixedRoomsCost();
  const updatedBedrooms = calculateBedroomsCost(bedrooms);
  const updatedBathrooms = calculateBathroomsCost(bathrooms);

  const allRooms = [
    ...updatedFixedRooms,
    ...updatedBedrooms,
    ...updatedBathrooms,
    ...customRooms
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tab Navigation */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const badge = tab.badge?.(state, totalCost);
              
              return (
                <button
                  key={tab.id}
                  id={`${tab.id}-tab`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap
                    transition-all duration-200 group
                    ${isActive ? `${tab.color.bg} ${tab.color.text} border-${tab.color.border}` : `text-gray-500 border-transparent ${tab.color.hover}`}
                  `}
                >
                  <tab.icon className={`h-5 w-5 mr-2 transition-colors duration-200 ${isActive ? tab.color.text : 'text-gray-400 group-hover:text-gray-500'}`} />
                  <span className="transition-colors duration-200">{tab.label}</span>
                  
                  {badge && (
                    <span className={`
                      ml-2 px-2 py-0.5 text-xs font-medium rounded-full
                      transition-colors duration-200
                      ${isActive ? `bg-${tab.color.text} bg-opacity-10` : 'bg-gray-100'}
                      ${isActive ? tab.color.text : 'text-gray-500'}
                    `}>
                      {badge}
                    </span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 ${tab.color.border}`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'property' && (
              <PropertyDetailsSection
                propertyDetails={propertyDetails}
                setPropertyDetails={setPropertyDetails}
                projectId={projectId}
              />
            )}

            {activeTab === 'rooms' && (
              <div className="space-y-8">
                <CommonAreasSection
                  fixedRooms={updatedFixedRooms}
                  onCustomize={onCustomizeRoom}
                />
                <BedroomsSection
                  bedrooms={updatedBedrooms}
                  onCustomize={onCustomizeBedroom}
                  onDelete={onDeleteBedroom}
                  onAddRoom={onAddBedroom}
                />
                <BathroomsSection
                  bathrooms={updatedBathrooms}
                  onCustomize={onCustomizeBathroom}
                  onDelete={onDeleteBathroom}
                  onAddRoom={onAddBathroom}
                />
                <CustomRoomsSection
                  customRooms={customRooms}
                  onAddRoom={onAddCustomRoom}
                  onEditRoom={onEditCustomRoom}
                  onDeleteRoom={onDeleteCustomRoom}
                  onCustomize={onCustomizeCustomRoom}
                />
                <DemoSection
                  demoItems={demoItems}
                  onUpdateDemoItems={setDemoItems}
                  rooms={allRooms}
                />
                <DoorManagementSection
                  doors={doors}
                  onAddDoor={onAddDoor}
                  onUpdateDoor={onUpdateDoor}
                  onDeleteDoor={onDeleteDoor}
                />
                <ProjectOutline
                  fixedRooms={updatedFixedRooms}
                  bedrooms={updatedBedrooms}
                  bathrooms={updatedBathrooms}
                  customRooms={customRooms}
                  totalCost={totalCost}
                />
              </div>
            )}

            {activeTab === 'materials' && (
              <MaterialsTab
                fixedRooms={updatedFixedRooms}
                bedrooms={updatedBedrooms}
                bathrooms={updatedBathrooms}
                customRooms={customRooms}
              />
            )}

            {activeTab === 'timeline' && (
              <ProjectTimeline
                fixedRooms={updatedFixedRooms}
                bedrooms={updatedBedrooms}
                bathrooms={updatedBathrooms}
                customRooms={customRooms}
                totalCost={totalCost}
              />
            )}

            {activeTab === 'recommendations' && (
              <RecommendationEngine
                fixedRooms={updatedFixedRooms}
                bedrooms={updatedBedrooms}
                bathrooms={updatedBathrooms}
                customRooms={customRooms}
                propertyDetails={propertyDetails}
                totalCost={totalCost}
              />
            )}

            {activeTab === 'costs' && (
              <CostTotalsTab
                fixedRooms={updatedFixedRooms}
                bedrooms={updatedBedrooms}
                bathrooms={updatedBathrooms}
                customRooms={customRooms}
                totalCost={totalCost}
              />
            )}

            {activeTab === 'guide' && (
              <CostGuideTab />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabContainer;