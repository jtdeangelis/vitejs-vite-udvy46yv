import React, { useState } from 'react';
import { CustomLineItem } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface CustomLineItemInputProps {
  lineItems: CustomLineItem[];
  onUpdateLineItems: (lineItems: CustomLineItem[]) => void;
}

const CustomLineItemInput: React.FC<CustomLineItemInputProps> = ({ 
  lineItems, 
  onUpdateLineItems 
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnitCost, setNewItemUnitCost] = useState(0);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Ensure lineItems is always an array
  const safeLineItems = Array.isArray(lineItems) ? lineItems : [];

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    const newId = safeLineItems.length > 0 
      ? Math.max(...safeLineItems.map(item => item.id)) + 1 
      : 1;
    
    const newItem: CustomLineItem = {
      id: newId,
      name: newItemName.trim(),
      quantity: newItemQuantity,
      unitCost: newItemUnitCost,
      totalCost: newItemQuantity * newItemUnitCost,
      description: newItemDescription.trim() || undefined
    };

    onUpdateLineItems([...safeLineItems, newItem]);
    
    // Reset form
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnitCost(0);
    setNewItemDescription('');
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: number) => {
    onUpdateLineItems(safeLineItems.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: number, field: keyof CustomLineItem, value: any) => {
    const updatedItems = safeLineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total cost when quantity or unit cost changes
        if (field === 'quantity' || field === 'unitCost') {
          updatedItem.totalCost = updatedItem.quantity * updatedItem.unitCost;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onUpdateLineItems(updatedItems);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-700">Custom Line Items</h3>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Custom Item
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., Custom Cabinetry"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={newItemUnitCost}
                onChange={(e) => setNewItemUnitCost(Math.max(0, parseInt(e.target.value) || 0))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={2}
              placeholder="Enter additional details about this item..."
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddItem}
              disabled={!newItemName.trim()}
              className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              Add Item
            </button>
          </div>
        </div>
      )}

      {safeLineItems.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-2 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Cost
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="relative py-2 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeLineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 pl-4 pr-3 text-sm">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
                    />
                    {item.description && (
                      <span className="text-xs text-gray-500 block mt-0.5">{item.description}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                      className="block w-16 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-xs">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={item.unitCost}
                        onChange={(e) => handleUpdateItem(item.id, 'unitCost', Math.max(0, parseInt(e.target.value) || 0))}
                        className="block w-24 pl-7 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalCost)}
                  </td>
                  <td className="py-2 pl-3 pr-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-gray-50">
                <td colSpan={3} className="py-2 pl-4 pr-3 text-sm font-medium text-gray-900 text-right">
                  Total
                </td>
                <td className="px-3 py-2 text-sm font-medium text-gray-900">
                  {formatCurrency(safeLineItems.reduce((sum, item) => sum + item.totalCost, 0))}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {safeLineItems.length === 0 && !showAddForm && (
        <p className="text-sm text-gray-500 italic">
          No custom items added. Click "Add Custom Item" to add specific items not covered in the standard options.
        </p>
      )}
    </div>
  );
};

export default CustomLineItemInput;