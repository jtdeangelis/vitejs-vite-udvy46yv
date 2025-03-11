import React, { useState } from 'react';
import { Room, CustomRoomOptions } from '../types';
import RoomCard from './RoomCard';
import CustomRoomModal from './CustomRoomModal';
import { Plus } from 'lucide-react';
import { calculateCustomRoomCost } from '../utils/costCalculator';

interface CustomRoomsSectionProps {
  customRooms: Room[];
  onAddRoom: (name: string, options: CustomRoomOptions) => void;
  onEditRoom: (id: number, name: string, options: CustomRoomOptions) => void;
  onDeleteRoom: (id: number) => void;
  onCustomize: (id: number) => void;
}

const CustomRoomsSection: React.FC<CustomRoomsSectionProps> = ({
  customRooms,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onCustomize
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const handleSaveRoom = (name: string, options: CustomRoomOptions) => {
    if (editingRoom) {
      onEditRoom(editingRoom.id, name, {
        ...options,
        name
      });
      setEditingRoom(null);
    } else {
      onAddRoom(name, {
        ...options,
        name
      });
    }
    setShowAddModal(false);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Custom Rooms</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Custom Room
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {customRooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onCustomize={() => onCustomize(room.id)}
            onEdit={() => {
              setEditingRoom(room);
              setShowAddModal(true);
            }}
            onDelete={() => onDeleteRoom(room.id)}
            isCustomRoom
          />
        ))}

        {customRooms.length === 0 && (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            No custom rooms added yet. Click the button above to add one.
          </div>
        )}
      </div>

      <CustomRoomModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingRoom(null);
        }}
        onSave={handleSaveRoom}
        existingOptions={editingRoom?.options}
        existingName={editingRoom?.name}
      />
    </div>
  );
};

export default CustomRoomsSection;