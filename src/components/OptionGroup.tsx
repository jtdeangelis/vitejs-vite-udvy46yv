import React, { ReactNode } from 'react';
import { useCostSettings } from '../context/CostSettingsContext';

interface OptionChoice {
  value: string;
  label: string;
  price: number;
}

interface OptionGroupProps {
  title: string;
  isNeeded: boolean;
  onToggleNeeded: (needed: boolean) => void;
  selectedType: string | null;
  onTypeChange: (type: string) => void;
  options: OptionChoice[];
  children?: ReactNode;
  showInstallType?: boolean;
  installType?: 'install' | 'refinish';
  onInstallTypeChange?: (type: 'install' | 'refinish') => void;
  isPaintGroup?: boolean;
  paintFinish?: 'flat' | 'eggshell' | 'satin' | 'semiGloss';
  onPaintFinishChange?: (finish: 'flat' | 'eggshell' | 'satin' | 'semiGloss') => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
  title,
  isNeeded,
  onToggleNeeded,
  selectedType,
  onTypeChange,
  options,
  children,
  showInstallType = false,
  installType = 'install',
  onInstallTypeChange,
  isPaintGroup = false,
  paintFinish = 'flat',
  onPaintFinishChange
}) => {
  const { settings } = useCostSettings();

  // Get the current price for the selected option
  const getCurrentPrice = (optionValue: string): number => {
    const category = title.toLowerCase().replace(/\s+/g, '');
    if (settings[category]) {
      if (isPaintGroup && selectedType && paintFinish) {
        return settings[category][selectedType]?.[paintFinish] || 0;
      }
      return settings[category][optionValue] || 0;
    }
    return options.find(opt => opt.value === optionValue)?.price || 0;
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="ml-4 space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isNeeded}
            onChange={(e) => onToggleNeeded(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Include {title.toLowerCase()}
          </label>
        </div>

        {isNeeded && (
          <div className="ml-6 space-y-3">
            {options.map((option) => {
              const currentPrice = getCurrentPrice(option.value);
              return (
                <label key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    value={option.value}
                    checked={selectedType === option.value}
                    onChange={() => onTypeChange(option.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {option.label} (${currentPrice}/unit)
                  </span>
                </label>
              );
            })}

            {isPaintGroup && onPaintFinishChange && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paint Finish
                </label>
                <select
                  value={paintFinish}
                  onChange={(e) => onPaintFinishChange(e.target.value as any)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="flat">Flat - Best for ceilings and low-traffic areas</option>
                  <option value="eggshell">Eggshell - Good for walls with subtle sheen</option>
                  <option value="satin">Satin - Ideal for high-traffic areas</option>
                  <option value="semiGloss">Semi-Gloss - Best for trim and high-moisture areas</option>
                </select>
              </div>
            )}
            
            {showInstallType && (selectedType === 'hardwood' || selectedType === 'engineered-hardwood') && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Installation Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="install"
                      checked={installType === 'install'}
                      onChange={() => onInstallTypeChange?.('install')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">New Installation</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="refinish"
                      checked={installType === 'refinish'}
                      onChange={() => onInstallTypeChange?.('refinish')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Refinish Existing</span>
                  </label>
                </div>
              </div>
            )}

            {children && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionGroup;