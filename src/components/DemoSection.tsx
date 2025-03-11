import React, { useState } from 'react';
import { Plus, Trash2, PenTool as Tool } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface DemoLineItem {
  id: number;
  roomName: string;
  description: string;
  cost: number;
  laborHours: number;
  notes: string;
}

interface DemoSectionProps {
  demoItems: DemoLineItem[];
  onUpdateDemoItems: (items: DemoLineItem[]) => void;
  rooms: Array<{ id: number; name: string }>;
}

const DemoSection: React.FC<DemoSectionProps> = ({
  demoItems,
  onUpdateDemoItems,
  rooms
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Omit<DemoLineItem, 'id'>>({
    roomName: '',
    description: '',
    cost: 0,
    laborHours: 0,
    notes: ''
  });

  const handleAddItem = () => {
    if (!newItem.description.trim() || !newItem.roomName) return;

    const newId = demoItems.length > 0 
      ? Math.max(...demoItems.map(item => item.id)) + 1 
      : 1;

    onUpdateDemoItems([
      ...demoItems,
      { ...newItem, id: newId }
    ]);

    setNewItem({
      roomName: '',
      description: '',
      cost: 0,
      laborHours: 0,
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: number) => {
    onUpdateDemoItems(demoItems.filter(item => item.id !== id));
  };

  const totalDemoCost = demoItems.reduce((sum, item) => sum + item.cost, 0);
  const totalLaborHours = demoItems.reduce((sum, item) => sum + item.laborHours, 0);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tool className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Demolition</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Demo Item
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room/Area
              </label>
              <select
                value={newItem.roomName}
                onChange={(e) => setNewItem({ ...newItem, roomName: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select room/area</option>
                <option value="General">General Demo</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.name}>{room.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Remove existing cabinets"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={newItem.cost}
                    onChange={(e) => setNewItem({ ...newItem, cost: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labor Hours
                </label>
                <input
                  type="number"
                  value={newItem.laborHours}
                  onChange={(e) => setNewItem({ ...newItem, laborHours: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                rows={2}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Additional notes or instructions..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={!newItem.description.trim() || !newItem.roomName}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                Add Item
              </button>
            </div>
          </div>
        )}

        {demoItems.length > 0 ? (
          <div className="space-y-6">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Room/Area</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cost</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Labor Hours</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {demoItems.map((item) => (
                    <tr key={item.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">{item.roomName}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.description}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{formatCurrency(item.cost)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.laborHours}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td colSpan={2} className="py-3 pl-4 pr-3 text-sm font-medium text-gray-900">Totals</td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">{formatCurrency(totalDemoCost)}</td>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">{totalLaborHours}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No demo items added yet. Click "Add Demo Item" to start adding demolition tasks.
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoSection;