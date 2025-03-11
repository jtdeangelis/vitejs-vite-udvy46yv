import React from 'react';
import { FileText, Download } from 'lucide-react';
import { Room, IndividualRoom } from '../types';

interface ProjectOutlineProps {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
}

const ProjectOutline: React.FC<ProjectOutlineProps> = ({
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms,
  totalCost
}) => {
  const generateOutline = () => {
    const outline = [];
    const date = new Date().toLocaleDateString();

    outline.push(`# Phoenix Rehab Project Outline\nGenerated: ${date}\n`);
    outline.push(`## Total Project Cost: $${totalCost.toLocaleString()}\n`);

    // Common Areas
    outline.push('\n## Common Areas');
    fixedRooms.forEach(room => {
      if (room.customized && room.options) {
        outline.push(`\n### ${room.name}`);
        outline.push(`- Status: Customized`);
        outline.push(`- Cost: $${room.cost.toLocaleString()}`);
        outline.push(`- Dimensions: ${room.options.dimensions.length}' × ${room.options.dimensions.width}'`);
        
        // Add feature details
        Object.entries(room.options).forEach(([key, value]: [string, any]) => {
          if (key !== 'dimensions' && key !== 'notes' && key !== 'customLineItems' && value?.needed) {
            outline.push(`- ${key.charAt(0).toUpperCase() + key.slice(1)}:`);
            if (value.type) outline.push(`  - Type: ${value.type}`);
            if (value.squareFeet) outline.push(`  - Area: ${value.squareFeet} sq ft`);
            if (value.linearFeet) outline.push(`  - Length: ${value.linearFeet} linear ft`);
            if (value.count) outline.push(`  - Count: ${value.count}`);
          }
        });

        // Add notes if present
        if (room.options.notes) {
          outline.push(`\nNotes: ${room.options.notes}`);
        }
      }
    });

    // Bedrooms
    outline.push('\n## Bedrooms');
    bedrooms.forEach(room => {
      if (room.customized && room.options) {
        outline.push(`\n### ${room.name}`);
        outline.push(`- Status: Customized`);
        outline.push(`- Cost: $${room.cost.toLocaleString()}`);
        outline.push(`- Dimensions: ${room.options.dimensions.length}' × ${room.options.dimensions.width}'`);
        
        Object.entries(room.options).forEach(([key, value]: [string, any]) => {
          if (key !== 'dimensions' && key !== 'notes' && key !== 'customLineItems' && value?.needed) {
            outline.push(`- ${key.charAt(0).toUpperCase() + key.slice(1)}:`);
            if (value.type) outline.push(`  - Type: ${value.type}`);
            if (value.squareFeet) outline.push(`  - Area: ${value.squareFeet} sq ft`);
            if (value.linearFeet) outline.push(`  - Length: ${value.linearFeet} linear ft`);
            if (value.count) outline.push(`  - Count: ${value.count}`);
          }
        });

        if (room.options.notes) {
          outline.push(`\nNotes: ${room.options.notes}`);
        }
      }
    });

    // Bathrooms
    outline.push('\n## Bathrooms');
    bathrooms.forEach(room => {
      if (room.customized && room.options) {
        outline.push(`\n### ${room.name}`);
        outline.push(`- Status: Customized`);
        outline.push(`- Cost: $${room.cost.toLocaleString()}`);
        outline.push(`- Dimensions: ${room.options.dimensions.length}' × ${room.options.dimensions.width}'`);
        
        Object.entries(room.options).forEach(([key, value]: [string, any]) => {
          if (key !== 'dimensions' && key !== 'notes' && key !== 'customLineItems' && value?.needed) {
            outline.push(`- ${key.charAt(0).toUpperCase() + key.slice(1)}:`);
            if (value.type) outline.push(`  - Type: ${value.type}`);
            if (value.squareFeet) outline.push(`  - Area: ${value.squareFeet} sq ft`);
            if (value.linearFeet) outline.push(`  - Length: ${value.linearFeet} linear ft`);
            if (value.count) outline.push(`  - Count: ${value.count}`);
          }
        });

        if (room.options.notes) {
          outline.push(`\nNotes: ${room.options.notes}`);
        }
      }
    });

    // Custom Rooms
    if (customRooms.length > 0) {
      outline.push('\n## Custom Rooms');
      customRooms.forEach(room => {
        if (room.customized && room.options) {
          outline.push(`\n### ${room.name}`);
          outline.push(`- Status: Customized`);
          outline.push(`- Cost: $${room.cost.toLocaleString()}`);
          outline.push(`- Dimensions: ${room.options.dimensions.length}' × ${room.options.dimensions.width}'`);
          
          Object.entries(room.options).forEach(([key, value]: [string, any]) => {
            if (key !== 'dimensions' && key !== 'notes' && key !== 'customLineItems' && value?.needed) {
              outline.push(`- ${key.charAt(0).toUpperCase() + key.slice(1)}:`);
              if (value.type) outline.push(`  - Type: ${value.type}`);
              if (value.squareFeet) outline.push(`  - Area: ${value.squareFeet} sq ft`);
              if (value.linearFeet) outline.push(`  - Length: ${value.linearFeet} linear ft`);
              if (value.count) outline.push(`  - Count: ${value.count}`);
            }
          });

          if (room.options.notes) {
            outline.push(`\nNotes: ${room.options.notes}`);
          }
        }
      });
    }

    return outline.join('\n');
  };

  const handleExport = () => {
    const outline = generateOutline();
    const blob = new Blob([outline], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-outline-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Project Outline</h2>
        <button
          onClick={handleExport}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Outline
        </button>
      </div>
      <div className="px-4 py-5 sm:p-6 space-y-6">
        {fixedRooms.map(room => (
          room.customized && (
            <div key={room.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{room.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Dimensions</p>
                  <p className="text-base">{room.options?.dimensions.length}' × {room.options?.dimensions.width}'</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cost</p>
                  <p className="text-base">${room.cost.toLocaleString()}</p>
                </div>
              </div>
              {room.options && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(room.options).map(([key, value]: [string, any]) => {
                    if (key !== 'dimensions' && key !== 'notes' && key !== 'customLineItems' && value?.needed) {
                      return (
                        <div key={key} className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-700">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </p>
                          <div className="mt-1 text-sm text-gray-500">
                            {value.type && <p>Type: {value.type}</p>}
                            {value.squareFeet && <p>Area: {value.squareFeet} sq ft</p>}
                            {value.linearFeet && <p>Length: {value.linearFeet} linear ft</p>}
                            {value.count && <p>Count: {value.count}</p>}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              {room.options?.notes && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-base">{room.options.notes}</p>
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default ProjectOutline;