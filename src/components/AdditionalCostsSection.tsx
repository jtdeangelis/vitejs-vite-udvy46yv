import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface AdditionalCostItem {
  id: number;
  name: string;
  cost: number;
}

interface AdditionalCostsSectionProps {
  additionalCosts: AdditionalCostItem[];
  setAdditionalCosts: React.Dispatch<React.SetStateAction<AdditionalCostItem[]>>;
}

const AdditionalCostsSection: React.FC<AdditionalCostsSectionProps> = ({ 
  additionalCosts, 
  setAdditionalCosts 
}) => {
  const [newCostName, setNewCostName] = useState('');
  
  const handleCostChange = (id: number, cost: number) => {
    setAdditionalCosts(prev => 
      prev.map(item => 
        item.id === id ? { ...item, cost } : item
      )
    );
  };
  
  const handleNameChange = (id: number, name: string) => {
    setAdditionalCosts(prev => 
      prev.map(item => 
        item.id === id ? { ...item, name } : item
      )
    );
  };
  
  const addNewCost = () => {
    if (newCostName.trim()) {
      const newId = Math.max(0, ...additionalCosts.map(item => item.id)) + 1;
      setAdditionalCosts([...additionalCosts, { id: newId, name: newCostName, cost: 0 }]);
      setNewCostName('');
    }
  };
  
  const removeCost = (id: number) => {
    // Don't allow removing the Labor cost
    if (id === 1) return;
    
    setAdditionalCosts(prev => prev.filter(item => item.id !== id));
  };
  
  const calculateTotal = () => {
    return additionalCosts.reduce((sum, item) => sum + item.cost, 0);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Additional Costs</h2>
        <p className="text-lg font-medium">Total: {formatCurrency(calculateTotal())}</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">
          Add labor costs and any other expenses not covered by the material estimates.
          Labor costs typically range from 30-50% of material costs depending on the complexity of the work.
        </p>
        
        <div className="space-y-4">
          {additionalCosts.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                disabled={item.id === 1} // Don't allow changing the Labor label
              />
              <div className="relative rounded-md shadow-sm min-w-[150px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={item.cost}
                  onChange={(e) => handleCostChange(item.id, parseFloat(e.target.value) || 0)}
                  className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                onClick={() => removeCost(item.id)}
                className={`p-2 text-red-500 hover:text-red-700 focus:outline-none ${item.id === 1 ? 'invisible' : ''}`}
                title="Remove cost"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={newCostName}
            onChange={(e) => setNewCostName(e.target.value)}
            placeholder="New cost item name"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <button
            onClick={addNewCost}
            disabled={!newCostName.trim()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Plus className="mr-1 w-4 h-4" />
            Add
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Suggested Labor Cost Calculation</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>30% of materials cost (simple renovations)</span>
            <button
              onClick={() => handleCostChange(1, Math.round(0.3 * (calculateTotal() - additionalCosts[0].cost)))}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Apply
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>40% of materials cost (moderate renovations)</span>
            <button
              onClick={() => handleCostChange(1, Math.round(0.4 * (calculateTotal() - additionalCosts[0].cost)))}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Apply
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>50% of materials cost (complex renovations)</span>
            <button
              onClick={() => handleCostChange(1, Math.round(0.5 * (calculateTotal() - additionalCosts[0].cost)))}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCostsSection;