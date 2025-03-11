import React from 'react';
import { Calculator, DollarSign, PenTool as Tool, PieChart, Wrench, Percent } from 'lucide-react';

const CostExplanationTab: React.FC = () => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex items-center">
          <Calculator className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Understanding Cost Calculations</h2>
        </div>
      </div>

      <div className="px-4 py-5 sm:p-6 space-y-8">
        {/* Base Costs */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Base Material Costs</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Base costs are calculated for each feature selected in a room. These include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Material costs per unit (sq ft, linear ft, or per item)</li>
            <li>Quantity of materials needed based on room dimensions</li>
            <li>Quality level adjustments (basic, premium, custom, etc.)</li>
          </ul>
        </div>

        {/* Labor Costs */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Tool className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Labor Costs</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Labor costs are calculated as a percentage of material costs:
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 font-medium">Labor Cost = 40% of Material Costs</p>
            <p className="text-sm text-gray-500 mt-2">
              This ratio is based on industry standards and accounts for skilled labor, installation, and finishing work.
            </p>
          </div>
        </div>

        {/* Additional Costs */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-purple-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Additional Costs</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 font-medium">Overhead (15%)</p>
              <p className="text-sm text-gray-500 mt-1">
                Covers project management, permits, insurance, and general contractor fees
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 font-medium">Contingency (10%)</p>
              <p className="text-sm text-gray-500 mt-1">
                Buffer for unexpected issues, repairs, or additional work discovered during renovation
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 font-medium">Profit Margin (20%)</p>
              <p className="text-sm text-gray-500 mt-1">
                Standard contractor profit margin for project execution and business sustainability
              </p>
            </div>
          </div>
        </div>

        {/* Cost Formula */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Wrench className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Total Cost Formula</h3>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="space-y-3">
              <p className="font-mono text-sm">1. Base Material Cost = Σ(Unit Price × Quantity)</p>
              <p className="font-mono text-sm">2. Labor Cost = Base Material Cost × 0.40</p>
              <p className="font-mono text-sm">3. Subtotal = Base Material Cost + Labor Cost</p>
              <p className="font-mono text-sm">4. Overhead = Subtotal × 0.15</p>
              <p className="font-mono text-sm">5. Contingency = Subtotal × 0.10</p>
              <p className="font-mono text-sm">6. Profit Margin = Subtotal × 0.20</p>
              <div className="pt-3 border-t border-gray-200">
                <p className="font-mono text-sm font-bold">
                  Total = Subtotal + Overhead + Contingency + Profit Margin
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown Example */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Percent className="h-5 w-5 text-red-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Cost Breakdown Example</h3>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="space-y-2">
              <p className="text-gray-600">For a room with $10,000 in materials:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Materials: $10,000</li>
                <li>Labor (40%): $4,000</li>
                <li>Subtotal: $14,000</li>
                <li>Overhead (15%): $2,100</li>
                <li>Contingency (10%): $1,400</li>
                <li>Profit Margin (20%): $2,800</li>
                <li className="pt-2 border-t border-gray-200 font-medium text-gray-700">
                  Total Cost: $20,300
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostExplanationTab;