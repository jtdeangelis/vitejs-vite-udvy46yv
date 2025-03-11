import React, { useState } from 'react';
import { DoorOption } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface DoorEntry extends DoorOption {
  id: number;
  name: string;
}

interface DoorManagementSectionProps {
  doors: DoorEntry[];
  onAddDoor: (door: Omit<DoorEntry, 'id'>) => void;
  onUpdateDoor: (id: number, door: Partial<DoorEntry>) => void;
  onDeleteDoor: (id: number) => void;
}

const DoorManagementSection: React.FC<DoorManagementSectionProps> = ({
  doors,
  onAddDoor,
  onUpdateDoor,
  onDeleteDoor
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoor, setNewDoor] = useState<Omit<DoorEntry, 'id'>>({
    name: '',
    needed: true,
    type: 'hollow-core',
    width: 30,
    handedness: 'left',
    location: 'interior'
  });

  const doorTypes = {
    interior: [
      { value: 'hollow-core', label: 'Hollow Core', price: 100 },
      { value: 'solid-core', label: 'Solid Core', price: 200 },
      { value: 'panel', label: 'Panel', price: 250 },
      { value: 'french', label: 'French', price: 400 },
      { value: 'pocket', label: 'Pocket', price: 500 },
      { value: 'barn', label: 'Barn', price: 600 }
    ],
    exterior: [
      { value: 'exterior-steel', label: 'Steel Entry', price: 500 },
      { value: 'exterior-fiberglass', label: 'Fiberglass Entry', price: 800 }
    ]
  };

  const handleAddDoor = () => {
    if (!newDoor.name.trim()) return;
    onAddDoor(newDoor);
    setNewDoor({
      name: '',
      needed: true,
      type: 'hollow-core',
      width: 30,
      handedness: 'left',
      location: 'interior'
    });
    setShowAddForm(false);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Door Replacements</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Door
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Door Name/Location
              </label>
              <input
                type="text"
                value={newDoor.name}
                onChange={(e) => setNewDoor({ ...newDoor, name: e.target.value })}
                placeholder="e.g., Front Entry Door, Master Bedroom Door"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Door Location
                </label>
                <select
                  value={newDoor.location}
                  onChange={(e) => setNewDoor({
                    ...newDoor,
                    location: e.target.value as 'interior' | 'exterior',
                    type: e.target.value === 'interior' ? 'hollow-core' : 'exterior-steel'
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Door Type
                </label>
                <select
                  value={newDoor.type}
                  onChange={(e) => setNewDoor({ ...newDoor, type: e.target.value as DoorOption['type'] })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {doorTypes[newDoor.location].map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label} (${type.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Door Width
                </label>
                <select
                  value={newDoor.width}
                  onChange={(e) => setNewDoor({ ...newDoor, width: parseInt(e.target.value) as 24 | 28 | 30 | 32 | 36 })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value={24}>24"</option>
                  <option value={28}>28"</option>
                  <option value={30}>30"</option>
                  <option value={32}>32"</option>
                  <option value={36}>36"</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Door Swing
                </label>
                <select
                  value={newDoor.handedness}
                  onChange={(e) => setNewDoor({ ...newDoor, handedness: e.target.value as 'left' | 'right' })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="left">Left Hand</option>
                  <option value="right">Right Hand</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDoor}
                disabled={!newDoor.name.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                Add Door
              </button>
            </div>
          </div>
        )}

        {doors.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Door</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Width</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Swing</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {doors.map((door) => (
                  <tr key={door.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                      {door.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <select
                        value={door.type}
                        onChange={(e) => onUpdateDoor(door.id, { type: e.target.value as DoorOption['type'] })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        {doorTypes[door.location].map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <select
                        value={door.width}
                        onChange={(e) => onUpdateDoor(door.id, { width: parseInt(e.target.value) as 24 | 28 | 30 | 32 | 36 })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value={24}>24"</option>
                        <option value={28}>28"</option>
                        <option value={30}>30"</option>
                        <option value={32}>32"</option>
                        <option value={36}>36"</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <select
                        value={door.handedness}
                        onChange={(e) => onUpdateDoor(door.id, { handedness: e.target.value as 'left' | 'right' })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="left">Left Hand</option>
                        <option value="right">Right Hand</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <select
                        value={door.location}
                        onChange={(e) => onUpdateDoor(door.id, {
                          location: e.target.value as 'interior' | 'exterior',
                          type: e.target.value === 'interior' ? 'hollow-core' : 'exterior-steel'
                        })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="interior">Interior</option>
                        <option value="exterior">Exterior</option>
                      </select>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <button
                        onClick={() => onDeleteDoor(door.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No doors added yet. Click "Add Door" to start adding doors that need to be replaced.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoorManagementSection;