import React from 'react';
import { IndividualRoom } from '../../types';
import IndividualRoomCard from '../IndividualRoomCard';
import AddRoomButton from '../AddRoomButton';

interface BathroomsSectionProps {
  bathrooms: IndividualRoom[];
  onCustomize: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  onAddRoom: (name: string) => void;
}

const BathroomsSection: React.FC<BathroomsSectionProps> = ({ 
  bathrooms, 
  onCustomize, 
  onDelete,
  onAddRoom
}) => {
  return (
    <div id="bathrooms-section" className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Bathrooms</h2>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {bathrooms.map((bathroom) => (
            <IndividualRoomCard 
              key={bathroom.id} 
              room={bathroom} 
              onCustomize={() => onCustomize(bathroom.id, bathroom.name)} 
              onDelete={() => onDelete(bathroom.id)}
            />
          ))}
        </ul>
        <AddRoomButton roomType="Bathroom" onAddRoom={onAddRoom} />
      </div>
    </div>
  );
};

export default BathroomsSection;