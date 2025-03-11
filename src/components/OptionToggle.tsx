import React from 'react';

interface OptionToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const OptionToggle: React.FC<OptionToggleProps> = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 transition-colors"
      />
      <span className={`text-gray-700 font-medium group-hover:text-blue-700 transition-colors ${checked ? 'text-blue-600' : ''}`}>
        {label}
      </span>
    </label>
  );
};

export default OptionToggle;