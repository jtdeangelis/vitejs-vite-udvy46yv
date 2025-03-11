import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import MeasurementGuide from './MeasurementGuide';

interface MaterialInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  roomType?: string;
  measurementType?: string;
}

const MaterialInput: React.FC<MaterialInputProps> = ({
  label,
  value,
  onChange,
  unit,
  min = 0,
  max = 10000,
  step = 1,
  disabled = false,
  roomType,
  measurementType
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-600">
          {label}
        </label>
        {roomType && measurementType && (
          <button 
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-blue-500 hover:text-blue-700 focus:outline-none"
            title="Show measurement guide"
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex">
        <div className="relative flex-1">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            disabled={disabled}
            className={`
              block w-full rounded-l-md border-gray-300 shadow-sm 
              focus:border-blue-500 focus:ring-blue-500 sm:text-sm
              ${disabled ? 'bg-gray-100' : ''}
            `}
          />
        </div>
        <div className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50">
          <span className="text-sm font-medium text-gray-600">{unit}</span>
        </div>
      </div>
      
      {showGuide && roomType && measurementType && (
        <MeasurementGuide roomType={roomType} measurementType={measurementType} />
      )}
    </div>
  );
};

export default MaterialInput;