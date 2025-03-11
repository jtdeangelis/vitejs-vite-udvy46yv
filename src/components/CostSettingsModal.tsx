import React, { useState } from 'react';
import Modal from 'react-modal';
import { useCostSettings } from '../context/CostSettingsContext';
import { Settings, DollarSign, Home, PenTool as Tool, Droplet, Lightbulb, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/modal.css';

interface CostSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CategoryGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  categories: string[];
};

const categoryGroups: CategoryGroup[] = [
  {
    id: 'finishes',
    label: 'Finishes & Materials',
    icon: <Home className="h-5 w-5 text-blue-500" />,
    categories: ['flooring', 'paint', 'tile', 'trim', 'backsplash']
  },
  {
    id: 'fixtures',
    label: 'Fixtures & Appliances',
    icon: <Tool className="h-5 w-5 text-green-500" />,
    categories: ['appliances', 'sink', 'toilet', 'shower', 'vanity', 'ventFan']
  },
  {
    id: 'storage',
    label: 'Storage & Built-ins',
    icon: <DollarSign className="h-5 w-5 text-purple-500" />,
    categories: ['cabinets', 'closet', 'storage', 'builtIns']
  },
  {
    id: 'lighting',
    label: 'Lighting & Electrical',
    icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
    categories: ['lighting', 'electrical']
  },
  {
    id: 'exterior',
    label: 'Exterior & Systems',
    icon: <Wind className="h-5 w-5 text-red-500" />,
    categories: ['siding', 'roof', 'windows', 'doors', 'driveway', 'landscaping', 'hvac']
  }
];

const unitLabels: Record<string, string> = {
  flooring: '/sq ft',
  paint: '/sq ft',
  tile: '/sq ft',
  trim: '/linear ft',
  backsplash: '/sq ft',
  appliances: '/unit',
  sink: '/unit',
  toilet: '/unit',
  shower: '/unit',
  vanity: '/linear ft',
  ventFan: '/unit',
  cabinets: '/linear ft',
  closet: '/sq ft',
  storage: '/linear ft',
  builtIns: '/linear ft',
  lighting: '/fixture',
  electrical: '/circuit',
  siding: '/sq ft',
  roof: '/sq ft',
  windows: '/unit',
  doors: '/unit',
  driveway: '/sq ft',
  landscaping: '/sq ft',
  hvac: '/unit'
};

const CostSettingsModal: React.FC<CostSettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateCategoryPrice, updateNestedCategoryPrice, resetToDefaults } = useCostSettings();
  const [selectedGroup, setSelectedGroup] = useState<string>('finishes');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCategoryName = (name: string) => {
    return name
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderPriceInput = (
    category: string,
    type: string,
    price: number,
    subCategory?: string
  ) => (
    <div className="flex items-center space-x-2" key={`${category}-${subCategory || ''}-${type}`}>
      <label className="flex-grow text-sm text-gray-700 flex justify-between items-center">
        <span>{formatCategoryName(type)}</span>
        <span className="text-gray-500 text-xs">{unitLabels[category] || '/unit'}</span>
      </label>
      <div className="relative rounded-md shadow-sm w-32">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => handlePriceChange(category, type, e.target.value, subCategory)}
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>
    </div>
  );

  const handlePriceChange = (
    category: string,
    type: string,
    price: string,
    subCategory?: string
  ) => {
    const numericPrice = parseFloat(price) || 0;
    if (subCategory) {
      updateNestedCategoryPrice(category, subCategory, type, numericPrice);
    } else {
      updateCategoryPrice(category, type, numericPrice);
    }
  };

  const renderCategoryContent = (category: string) => {
    const categorySettings = settings[category];
    if (!categorySettings) return null;

    if (typeof categorySettings === 'object' && 'interior' in categorySettings) {
      return (
        <div className="space-y-6">
          {Object.entries(categorySettings).map(([subCategory, subSettings]) => (
            <div key={subCategory} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                {formatCategoryName(subCategory)}
              </h4>
              <div className="space-y-3">
                {Object.entries(subSettings as Record<string, number>).map(([type, price]) => 
                  renderPriceInput(category, type, price, subCategory)
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {Object.entries(categorySettings as Record<string, number>).map(([type, price]) => 
          renderPriceInput(category, type, price)
        )}
      </div>
    );
  };

  const filteredCategories = searchTerm
    ? Object.keys(settings).filter(category => 
        category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categoryGroups.find(group => group.id === selectedGroup)?.categories || [];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content settings-modal"
      overlayClassName="modal-overlay"
    >
      <div className="settings-modal-body">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Cost Settings</h2>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {!searchTerm && (
              <nav className="space-y-1">
                {categoryGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      selectedGroup === group.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {group.icon}
                    <span className="ml-3">{group.label}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="settings-content">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGroup + searchTerm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {searchTerm ? (
                  <div className="space-y-8">
                    {filteredCategories.map(category => (
                      <div key={category} className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {formatCategoryName(category)}
                        </h3>
                        {renderCategoryContent(category)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {categoryGroups
                      .find(group => group.id === selectedGroup)
                      ?.categories.map(category => (
                        <div key={category} className="bg-white p-6 rounded-lg shadow-sm">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {formatCategoryName(category)}
                          </h3>
                          {renderCategoryContent(category)}
                        </div>
                      ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="settings-footer">
        <div className="flex justify-between items-center">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset to Defaults
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CostSettingsModal;