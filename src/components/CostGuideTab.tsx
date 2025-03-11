import React from 'react';
import { DollarSign, PenTool as Tool, PieChart, Info, Lightbulb } from 'lucide-react';

const CostGuideTab: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Material Quality Levels */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Tool className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium">Material Quality Levels</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Basic Grade</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Standard builder-grade materials</li>
                <li>• Good durability for normal use</li>
                <li>• Common finishes and styles</li>
                <li>• 5-10 year lifespan</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Premium Grade</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Higher quality materials</li>
                <li>• Enhanced durability</li>
                <li>• More style options</li>
                <li>• 10-20 year lifespan</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Luxury Grade</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Top-tier materials</li>
                <li>• Maximum durability</li>
                <li>• Custom options available</li>
                <li>• 20+ year lifespan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown Structure */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <PieChart className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-medium">Cost Breakdown Structure</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Direct Costs (70%)</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Materials (40-45%)</p>
                <p>• Labor (25-30%)</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Overhead (15%)</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Project Management</p>
                <p>• Permits & Inspections</p>
                <p>• Insurance</p>
                <p>• Equipment</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Contingency (10%)</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Unexpected issues</p>
                <p>• Additional repairs</p>
                <p>• Material price fluctuations</p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Profit Margin (20%)</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Contractor profit</p>
                <p>• Business sustainability</p>
                <p>• Risk coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Saving Tips */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2" />
            <h2 className="text-lg font-medium">Cost Saving Tips</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Material Selection</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Consider mid-grade materials for better value</li>
                <li>• Look for closeout sales and remnants</li>
                <li>• Reuse existing materials when possible</li>
                <li>• Choose timeless designs over trends</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Project Planning</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bundle similar work for efficiency</li>
                <li>• Plan renovations during off-peak seasons</li>
                <li>• Get multiple contractor quotes</li>
                <li>• Phase work if budget constrained</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ROI Considerations */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-medium">ROI Considerations</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">High ROI Improvements</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Kitchen remodels (60-80% ROI)</li>
                <li>• Bathroom updates (50-70% ROI)</li>
                <li>• Curb appeal improvements (70-80% ROI)</li>
                <li>• Energy efficiency upgrades (50-80% ROI)</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Market Factors</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Local real estate trends</li>
                <li>• Neighborhood comparables</li>
                <li>• Buyer preferences</li>
                <li>• Economic conditions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-medium">Additional Resources</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Research Tools</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Local building codes</li>
                <li>• Material price indexes</li>
                <li>• Contractor directories</li>
                <li>• Design inspiration galleries</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Professional Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Architects & Designers</li>
                <li>• General Contractors</li>
                <li>• Home Inspectors</li>
                <li>• Real Estate Appraisers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostGuideTab;