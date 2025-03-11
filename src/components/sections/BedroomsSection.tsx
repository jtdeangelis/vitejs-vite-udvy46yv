import React from 'react';
import { IndividualRoom } from '../../types';
import IndividualRoomCard from '../IndividualRoomCard';
import AddRoomButton from '../AddRoomButton';

interface BedroomsSectionProps {
  bedrooms: IndividualRoom[];
  onCustomize: (id: number, name: string) => void;
  onDelete: (id: number) => void;
  onAddRoom: (name: string) => void;
}

const BedroomsSection: React.FC<BedroomsSectionProps> = ({ 
  bedrooms, 
  onCustomize, 
  onDelete,
  onAddRoom
}) => {
  return (
    <div id="bedrooms-section" className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Bedrooms</h2>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {bedrooms.map((bedroom) => (
            <IndividualRoomCard 
              key={bedroom.id} 
              room={bedroom} 
              onCustomize={() => onCustomize(bedroom.id, bedroom.name)} 
              onDelete={() => onDelete(bedroom.id)}
            />
          ))}
        </ul>
        <AddRoomButton roomType="Bedroom" onAddRoom={onAddRoom} />
      </div>
    </div>
  );
};

export default BedroomsSection;