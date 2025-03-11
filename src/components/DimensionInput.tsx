import React from 'react';
import { HelpCircle } from 'lucide-react';

interface DimensionInputProps {
  label: string;
  length: number;
  width: number;
  onLengthChange: (length: number) => void;
  onWidthChange: (width: number) => void;
  calculateArea?: boolean;
}

const DimensionInput: React.FC<DimensionInputProps> = ({
  label,
  length,
  width,
  onLengthChange,
  onWidthChange,
  calculateArea = true
}) => {
  const area = length * width;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-gray-700">{label}</h3>
        <div className="text-blue-500 text-sm flex items-center">
          <HelpCircle className="h-4 w-4 mr-1" />
          <span>Measurements in feet</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Length (ft)
          </label>
          <input
            type="number"
            min="1"
            value={length}
            onChange={(e) => onLengthChange(Math.max(1, parseInt(e.target.value) || 0))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Width (ft)
          </label>
          <input
            type="number"
            min="1"
            value={width}
            onChange={(e) => onWidthChange(Math.max(1, parseInt(e.target.value) || 0))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      {calculateArea && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Area:</span> {area} sq ft
            <span className="block mt-1">
              This is the total floor area of the room, calculated by multiplying length × width.
              Use this to estimate flooring materials and overall room size.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default DimensionInput;