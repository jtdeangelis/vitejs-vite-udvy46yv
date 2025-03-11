import React from 'react';
import { Room } from '../../types';
import RoomCard from '../RoomCard';

interface CommonAreasSectionProps {
  fixedRooms: Room[];
  onCustomize: (roomName: string) => void;
}

const CommonAreasSection: React.FC<CommonAreasSectionProps> = ({ 
  fixedRooms, 
  onCustomize 
}) => {
  // Filter out the Doors row
  const visibleRooms = fixedRooms.filter(room => room.name !== 'Doors');

  return (
    <div id="common-areas-section" className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Common Areas</h2>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {visibleRooms.map((room) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              onCustomize={() => onCustomize(room.name)} 
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommonAreasSection;