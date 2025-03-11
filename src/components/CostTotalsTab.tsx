import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, Building, PenTool as Tool, PieChart, TrendingUp, Settings, Clock } from 'lucide-react';
import { Room, IndividualRoom } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CostTotalsTabProps {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  totalCost: number;
}

const CostTotalsTab: React.FC<CostTotalsTabProps> = ({
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms,
  totalCost
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['breakdown', 'overhead', 'roi']);
  const [isEditingOverhead, setIsEditingOverhead] = useState(false);
  const [overheadRates, setOverheadRates] = useState({
    projectManagement: 0.05,
    permitsAndInspections: 0.03,
    insuranceAndBonds: 0.02,
    equipmentAndTools: 0.03,
    miscellaneous: 0.02
  });
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [estimatedARV, setEstimatedARV] = useState(350000);
  const [holdingCosts, setHoldingCosts] = useState(15000);
  const [realtorFees, setRealtorFees] = useState(0.06);
  const [closingCosts, setClosingCosts] = useState(0.02);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const allRooms = [...fixedRooms, ...bedrooms, ...bathrooms, ...customRooms];
  const customizedRooms = allRooms.filter(room => room.customized);

  // Calculate base costs
  const materialCost = totalCost * 0.6;
  const laborCost = totalCost * 0.4;
  const subtotal = materialCost + laborCost;

  // Calculate overhead costs using custom rates
  const projectManagement = subtotal * overheadRates.projectManagement;
  const permitsAndInspections = subtotal * overheadRates.permitsAndInspections;
  const insuranceAndBonds = subtotal * overheadRates.insuranceAndBonds;
  const equipmentAndTools = subtotal * overheadRates.equipmentAndTools;
  const miscellaneous = subtotal * overheadRates.miscellaneous;
  const totalOverhead = Object.values(overheadRates).reduce((sum, rate) => sum + (subtotal * rate), 0);

  // Calculate other costs
  const contingency = subtotal * 0.10;
  const profitMargin = subtotal * 0.20;

  // Calculate ROI metrics
  const totalInvestment = purchasePrice + totalCost + holdingCosts;
  const totalSalesCosts = estimatedARV * (realtorFees + closingCosts);
  const netProfit = estimatedARV - totalInvestment - totalSalesCosts;
  const roi = (netProfit / totalInvestment) * 100;
  const cashOnCash = (netProfit / totalCost) * 100;

  return (
    <div className="space-y-6">
      {/* Project Cost Summary */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Project Cost Summary</h2>
        </div>
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium text-blue-900">Total Cost</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-blue-600">{formatCurrency(totalCost)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Tool className="h-6 w-6 text-green-500 mr-2" />
                <h3 className="text-lg font-medium text-green-900">Rooms Customized</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600">{customizedRooms.length} of {allRooms.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Building className="h-6 w-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-medium text-purple-900">Average Per Room</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {formatCurrency(totalCost / customizedRooms.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => toggleSection('breakdown')}
          className="w-full px-6 py-5 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50"
        >
          <div className="flex items-center">
            <PieChart className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Cost Breakdown</h2>
          </div>
          {expandedSections.includes('breakdown') ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.includes('breakdown') && (
          <div className="px-6 py-5">
            <div className="space-y-6">
              {/* Room-by-room breakdown */}
              {customizedRooms.map(room => (
                <div key={room.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{room.name}</h3>
                    <span className="text-lg font-medium text-blue-600">{formatCurrency(room.cost)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p>Materials: {formatCurrency(room.cost * 0.6)}</p>
                      <p>Labor: {formatCurrency(room.cost * 0.4)}</p>
                    </div>
                    <div>
                      <p>Overhead: {formatCurrency(room.cost * 0.15)}</p>
                      <p>Profit: {formatCurrency(room.cost * 0.20)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Total breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div className="col-span-2 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">Project Totals</h3>
                  </div>
                  <div>
                    <p className="text-gray-600">Materials Cost:</p>
                    <p className="font-medium text-gray-900">{formatCurrency(materialCost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Labor Cost:</p>
                    <p className="font-medium text-gray-900">{formatCurrency(laborCost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Overhead:</p>
                    <p className="font-medium text-gray-900">{formatCurrency(totalOverhead)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Contingency:</p>
                    <p className="font-medium text-gray-900">{formatCurrency(contingency)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Profit Margin:</p>
                    <p className="font-medium text-gray-900">{formatCurrency(profitMargin)}</p>
                  </div>
                  <div className="col-span-2 mt-4 pt-4 border-t border-gray-200">
                    <p className="text-lg font-medium text-gray-900">Total Project Cost:</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCost)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overhead Breakdown */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => toggleSection('overhead')}
          className="w-full px-6 py-5 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50"
        >
          <div className="flex items-center">
            <Building className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Overhead Breakdown</h2>
          </div>
          {expandedSections.includes('overhead') ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.includes('overhead') && (
          <div className="px-6 py-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Overhead Categories</h3>
              <button
                onClick={() => setIsEditingOverhead(!isEditingOverhead)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Settings className="h-4 w-4 mr-1.5" />
                {isEditingOverhead ? 'Save Changes' : 'Customize Rates'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Project Management</p>
                      <p className="text-sm text-gray-500">Supervision, coordination, and administrative costs</p>
                    </div>
                    <div className="flex items-center">
                      {isEditingOverhead ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={overheadRates.projectManagement * 100}
                            onChange={(e) => setOverheadRates(prev => ({
                              ...prev,
                              projectManagement: parseFloat(e.target.value) / 100
                            }))}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="font-medium text-blue-600">
                          {formatCurrency(projectManagement)} ({(overheadRates.projectManagement * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Permits & Inspections</p>
                      <p className="text-sm text-gray-500">Building permits, inspections, and compliance costs</p>
                    </div>
                    <div className="flex items-center">
                      {isEditingOverhead ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={overheadRates.permitsAndInspections * 100}
                            onChange={(e) => setOverheadRates(prev => ({
                              ...prev,
                              permitsAndInspections: parseFloat(e.target.value) / 100
                            }))}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="font-medium text-blue-600">
                          {formatCurrency(permitsAndInspections)} ({(overheadRates.permitsAndInspections * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Insurance & Bonds</p>
                      <p className="text-sm text-gray-500">Liability insurance, workers comp, and performance bonds</p>
                    </div>
                    <div className="flex items-center">
                      {isEditingOverhead ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={overheadRates.insuranceAndBonds * 100}
                            onChange={(e) => setOverheadRates(prev => ({
                              ...prev,
                              insuranceAndBonds: parseFloat(e.target.value) / 100
                            }))}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="font-medium text-blue-600">
                          {formatCurrency(insuranceAndBonds)} ({(overheadRates.insuranceAndBonds * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Equipment & Tools</p>
                      <p className="text-sm text-gray-500">Rental equipment, specialized tools, and temporary facilities</p>
                    </div>
                    <div className="flex items-center">
                      {isEditingOverhead ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={overheadRates.equipmentAndTools * 100}
                            onChange={(e) => setOverheadRates(prev => ({
                              ...prev,
                              equipmentAndTools: parseFloat(e.target.value) / 100
                            }))}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="font-medium text-blue-600">
                          {formatCurrency(equipmentAndTools)} ({(overheadRates.equipmentAndTools * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">Miscellaneous</p>
                      <p className="text-sm text-gray-500">Cleanup, waste removal, temporary utilities, and other indirect costs</p>
                    </div>
                    <div className="flex items-center">
                      {isEditingOverhead ? (
                        <div className="flex items-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={overheadRates.miscellaneous * 100}
                            onChange={(e) => setOverheadRates(prev => ({
                              ...prev,
                              miscellaneous: parseFloat(e.target.value) / 100
                            }))}
                            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <span className="ml-2 text-gray-500">%</span>
                        </div>
                      ) : (
                        <span className="font-medium text-blue-600">
                          {formatCurrency(miscellaneous)} ({(overheadRates.miscellaneous * 100).toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-gray-900">Total Overhead</p>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(totalOverhead)} ({(Object.values(overheadRates).reduce((sum, rate) => sum + rate, 0) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ROI Analysis */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <button
          onClick={() => toggleSection('roi')}
          className="w-full px-6 py-5 border-b border-gray-200 flex justify-between items-center hover:bg-gray-50"
        >
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">ROI Analysis</h2>
          </div>
          {expandedSections.includes('roi') ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>

        {expandedSections.includes('roi') && (
          <div className="px-6 py-5">
            <div className="space-y-6">
              {/* Investment Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Price
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="block w-full pl-7 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated ARV
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={estimatedARV}
                      onChange={(e) => setEstimatedARV(Math.max(0, parseInt(e.target.value) || 0))}
                      className="block w-full pl-7 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Holding Costs
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      value={holdingCosts}
                      onChange={(e) => setHoldingCosts(Math.max(0, parseInt(e.target.value) || 0))}
                      className="block w-full pl-7 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Realtor Fees (%)
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={realtorFees * 100}
                      onChange={(e) => setRealtorFees(Math.max(0, parseFloat(e.target.value) || 0) / 100)}
                      className="block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Total Investment</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Purchase Price:</span>
                        <span>{formatCurrency(purchasePrice)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Renovation Cost:</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Holding Costs:</span>
                        <span>{formatCurrency(holdingCosts)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                        <span>Total Investment:</span>
                        <span>{formatCurrency(totalInvestment)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Exit Strategy</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Estimated ARV:</span>
                        <span>{formatCurrency(estimatedARV)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Realtor Fees ({(realtorFees * 100).toFixed(1)}%):</span>
                        <span>{formatCurrency(estimatedARV * realtorFees)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Closing Costs ({(closingCosts * 100).toFixed(1)}%):</span>
                        <span>{formatCurrency(estimatedARV * closingCosts)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-2 border-t border-gray-200">
                        <span>Net Sale Proceeds:</span>
                        <span>{formatCurrency(estimatedARV - totalSalesCosts)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Net Profit</h4>
                      <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(netProfit)}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">ROI</h4>
                      <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Cash on Cash Return</h4>
                      <p className={`text-2xl font-bold ${cashOnCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {cashOnCash.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">ROI Analysis</h4>
                <p className="text-sm text-blue-700">
                  {roi >= 20 ? (
                    'Excellent ROI potential! This project shows strong profit potential with a healthy margin for unexpected costs.'
                  ) : roi >= 10 ? (
                    'Good ROI potential. The project shows solid returns but consider ways to optimize costs or increase ARV.'
                  ) : roi >= 0 ? (
                    'Moderate ROI. Consider ways to reduce costs or increase property value to improve returns.'
                  ) : (
                    'Caution: Negative ROI projected. Review costs and ARV assumptions carefully before proceeding.'
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostTotalsTab;