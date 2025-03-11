import React from 'react';

interface OptionRadioProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  price?: number;
}

const OptionRadio: React.FC<OptionRadioProps> = ({ label, value, checked, onChange, price }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="radio"
        name={`option-${value}`}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 focus:ring-blue-500 transition-all"
      />
      <span className={`text-gray-700 group-hover:text-blue-600 transition-colors ${checked ? 'font-medium text-blue-700' : ''}`}>
        {label}{price ? ` ($${typeof price === 'number' && price > 100 ? price.toLocaleString() : price})` : ''}
      </span>
    </label>
  );
};

export default OptionRadio;