import React from 'react';

interface RoomCountSelectorProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  label: string;
  min?: number;
  max?: number;
}

const RoomCountSelector: React.FC<RoomCountSelectorProps> = ({ 
  count, 
  setCount, 
  label,
  min = 1,
  max = 10
}) => {
  const increment = () => {
    if (count < max) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > min) {
      setCount(count - 1);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center">
        <button
          type="button"
          onClick={decrement}
          disabled={count <= min}
          className={`p-2 rounded-l-md border border-gray-300 ${
            count <= min ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="px-4 py-2 w-16 text-center border-t border-b border-gray-300 bg-white">
          {count}
        </div>
        <button
          type="button"
          onClick={increment}
          disabled={count >= max}
          className={`p-2 rounded-r-md border border-gray-300 ${
            count >= max ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default RoomCountSelector;