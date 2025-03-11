import React from 'react';
import { Info } from 'lucide-react';

interface MaterialOption {
  value: string;
  label: string;
  price: number;
  description?: string;
}

interface MaterialSelectorProps {
  label: string;
  options: MaterialOption[];
  selectedOption: string;
  onSelect: (value: string) => void;
  infoText?: string;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
  infoText
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {infoText && (
          <div className="group relative">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="absolute right-0 w-64 p-2 mt-1 text-xs text-gray-600 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              {infoText}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center justify-between p-3 rounded-lg border cursor-pointer
              ${selectedOption === option.value 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'}
            `}
          >
            <div className="flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                checked={selectedOption === option.value}
                onChange={() => onSelect(option.value)}
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-gray-500">{option.description}</div>
                )}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              ${option.price}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default MaterialSelector;