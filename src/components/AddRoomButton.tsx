import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface AddRoomButtonProps {
  roomType: string;
  onAddRoom: (name: string) => void;
}

const AddRoomButton: React.FC<AddRoomButtonProps> = ({ roomType, onAddRoom }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [roomName, setRoomName] = useState('');

  const handleAddRoom = () => {
    if (roomName.trim()) {
      onAddRoom(roomName.trim());
      setRoomName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="mt-3 mb-6">
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="mr-2 h-5 w-5 text-gray-500" />
          Add {roomType}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder={`Enter ${roomType.toLowerCase()} name`}
            className="block w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddRoom();
              if (e.key === 'Escape') setIsAdding(false);
            }}
          />
          <button
            onClick={handleAddRoom}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default AddRoomButton;