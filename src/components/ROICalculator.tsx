import React, { useState, useEffect } from 'react';
import { PropertyDetails } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ROICalculatorProps {
  propertyDetails: PropertyDetails;
  renovationCost: number;
}

const ROICalculator: React.FC<ROICalculatorProps> = ({ 
  propertyDetails, 
  renovationCost 
}) => {
  const [holdingPeriod, setHoldingPeriod] = useState(6); // months
  const [monthlyHoldingCosts, setMonthlyHoldingCosts] = useState({
    mortgage: 2000,
    utilities: 300,
    insurance: 150,
    taxes: 400
  });

  // Calculate monthly holding costs
  const monthlyHoldingCost = Object.values(monthlyHoldingCosts).reduce((sum, cost) => sum + cost, 0);

  // Calculate total holding costs for project duration
  const totalHoldingCost = monthlyHoldingCost * (holdingPeriod / 30);

  // Calculate total investment
  const totalInvestment = (propertyDetails?.purchasePrice || 0) + renovationCost + totalHoldingCost;

  // Calculate potential profit
  const potentialProfit = (propertyDetails?.estimatedARV || 0) - totalInvestment;

  // Calculate ROI
  const roi = totalInvestment > 0 ? (potentialProfit / totalInvestment) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">ROI Calculator</h2>
          <p className="mt-1 text-sm text-gray-500">
            Calculate your potential return on investment
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Investment Costs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-3">Investment Costs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Purchase Price:</span>
                  <span className="font-medium">{formatCurrency(propertyDetails?.purchasePrice || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Renovation Costs:</span>
                  <span className="font-medium">{formatCurrency(renovationCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Holding Costs ({holdingPeriod} months):</span>
                  <span className="font-medium">{formatCurrency(totalHoldingCost)}</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex justify-between font-bold">
                    <span>Total Investment:</span>
                    <span>{formatCurrency(totalInvestment)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Holding Period Controls */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-3">Holding Period</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Holding Period (months)
                  </label>
                  <input
                    type="number"
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(Math.max(1, parseInt(e.target.value) || 0))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Monthly Holding Costs */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-3">Monthly Holding Costs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Mortgage/Loan Payment
                  </label>
                  <input
                    type="number"
                    value={monthlyHoldingCosts.mortgage}
                    onChange={(e) => setMonthlyHoldingCosts(prev => ({
                      ...prev,
                      mortgage: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Utilities
                  </label>
                  <input
                    type="number"
                    value={monthlyHoldingCosts.utilities}
                    onChange={(e) => setMonthlyHoldingCosts(prev => ({
                      ...prev,
                      utilities: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Insurance
                  </label>
                  <input
                    type="number"
                    value={monthlyHoldingCosts.insurance}
                    onChange={(e) => setMonthlyHoldingCosts(prev => ({
                      ...prev,
                      insurance: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Property Taxes
                  </label>
                  <input
                    type="number"
                    value={monthlyHoldingCosts.taxes}
                    onChange={(e) => setMonthlyHoldingCosts(prev => ({
                      ...prev,
                      taxes: Math.max(0, parseInt(e.target.value) || 0)
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Returns Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-gray-700 mb-3">Returns</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Estimated ARV:</span>
                  <span className="font-medium">{formatCurrency(propertyDetails?.estimatedARV || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Investment:</span>
                  <span className="font-medium">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="pt-2 border-t border-gray-300">
                  <div className="flex justify-between font-bold">
                    <span>Potential Profit:</span>
                    <span className={potentialProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(potentialProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold mt-1">
                    <span>ROI:</span>
                    <span className={roi >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {roi.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-blue-700 mb-2">ROI Analysis</h3>
              <p className="text-sm text-blue-600">
                {roi >= 20 ? (
                  'Excellent ROI! This project has strong profit potential.'
                ) : roi >= 10 ? (
                  'Good ROI. This project has solid profit potential.'
                ) : roi >= 0 ? (
                  'Moderate ROI. Consider ways to reduce costs or increase ARV.'
                ) : (
                  'Negative ROI. This project may not be profitable with current numbers.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;