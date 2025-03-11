import React, { useState, useEffect } from 'react';
import { Room, IndividualRoom, PropertyDetails } from '../types';
import { 
  LightbulbIcon, 
  ChevronRight, 
  ChevronDown, 
  ThumbsUp, 
  ThumbsDown, 
  Lightbulb, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  PenTool as Tool, 
  Info,
  Home,
  Droplet,
  Leaf,
  Clock,
  Shield,
  Star,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';

interface RecommendationEngineProps {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  propertyDetails: PropertyDetails;
  totalCost: number;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  savings: number | null;
  valueIncrease: number | null;
  roomType: string;
  roomId: number | null;
  priority: 'high' | 'medium' | 'low';
  category: 'cost-saving' | 'value-add' | 'energy-efficiency' | 'maintenance' | 'safety' | 'sustainability';
  liked: boolean | null;
  impact: 'immediate' | 'short-term' | 'long-term';
  difficulty: 'easy' | 'moderate' | 'complex';
  timeframe: number; // in days
  prerequisites?: string[];
  alternatives?: string[];
  risks?: string[];
  benefits: string[];
}

const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms,
  propertyDetails,
  totalCost
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['cost-saving', 'value-add']);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<{
    priority: string[];
    impact: string[];
    difficulty: string[];
  }>({
    priority: [],
    impact: [],
    difficulty: []
  });
  const [sortBy, setSortBy] = useState<'priority' | 'savings' | 'roi' | 'timeframe'>('priority');

  useEffect(() => {
    generateRecommendations();
  }, [fixedRooms, bedrooms, bathrooms, customRooms, propertyDetails, totalCost]);

  const generateRecommendations = () => {
    setLoading(true);
    
    setTimeout(() => {
      const generatedRecommendations: Recommendation[] = [
        // Cost-saving recommendations
        {
          id: 'cost-1',
          title: 'Phase renovation strategically',
          description: 'Breaking your renovation into strategic phases can optimize cash flow and reduce financing costs.',
          savings: Math.round(totalCost * 0.15),
          valueIncrease: null,
          roomType: 'general',
          roomId: null,
          priority: 'high',
          category: 'cost-saving',
          liked: null,
          impact: 'immediate',
          difficulty: 'moderate',
          timeframe: 30,
          benefits: [
            'Reduced upfront costs',
            'Better cash flow management',
            'More flexibility in decision making',
            'Ability to adjust plans based on results'
          ]
        },
        
        // Value-add recommendations
        {
          id: 'value-1',
          title: 'Smart home integration',
          description: 'Integrate smart home features throughout the renovation for increased property value and efficiency.',
          savings: 1200,
          valueIncrease: 15000,
          roomType: 'general',
          roomId: null,
          priority: 'medium',
          category: 'value-add',
          liked: null,
          impact: 'long-term',
          difficulty: 'moderate',
          timeframe: 14,
          benefits: [
            'Increased property value',
            'Enhanced energy efficiency',
            'Improved home security',
            'Better comfort and convenience'
          ]
        },
        
        // Energy efficiency recommendations
        {
          id: 'energy-1',
          title: 'Comprehensive insulation upgrade',
          description: 'Upgrade insulation in walls, attic, and crawl spaces to maximize energy efficiency.',
          savings: 3600,
          valueIncrease: 8000,
          roomType: 'exterior',
          roomId: null,
          priority: 'high',
          category: 'energy-efficiency',
          liked: null,
          impact: 'long-term',
          difficulty: 'moderate',
          timeframe: 7,
          benefits: [
            'Reduced energy bills',
            'Improved comfort',
            'Better sound insulation',
            'Increased property value'
          ]
        },
        
        // Maintenance recommendations
        {
          id: 'maintenance-1',
          title: 'Preventive plumbing upgrade',
          description: 'Replace aging plumbing infrastructure during renovation to prevent future issues.',
          savings: 7500,
          valueIncrease: 12000,
          roomType: 'general',
          roomId: null,
          priority: 'high',
          category: 'maintenance',
          liked: null,
          impact: 'long-term',
          difficulty: 'complex',
          timeframe: 10,
          benefits: [
            'Prevent costly water damage',
            'Improve water pressure',
            'Reduce risk of leaks',
            'Update to modern standards'
          ]
        },
        
        // Safety recommendations
        {
          id: 'safety-1',
          title: 'Comprehensive electrical system update',
          description: 'Modernize electrical system to meet current safety codes and handle modern power demands.',
          savings: null,
          valueIncrease: 20000,
          roomType: 'general',
          roomId: null,
          priority: 'high',
          category: 'safety',
          liked: null,
          impact: 'immediate',
          difficulty: 'complex',
          timeframe: 14,
          benefits: [
            'Enhanced safety',
            'Increased capacity for modern appliances',
            'Reduced fire risk',
            'Better insurance rates'
          ]
        },
        
        // Sustainability recommendations
        {
          id: 'sustainability-1',
          title: 'Water conservation system',
          description: 'Install water-efficient fixtures and rainwater harvesting system.',
          savings: 2400,
          valueIncrease: 5000,
          roomType: 'general',
          roomId: null,
          priority: 'medium',
          category: 'sustainability',
          liked: null,
          impact: 'long-term',
          difficulty: 'moderate',
          timeframe: 5,
          benefits: [
            'Reduced water bills',
            'Environmental impact',
            'Drought resistance',
            'Modern appeal to buyers'
          ]
        }
      ];

      // Add room-specific recommendations
      const kitchen = fixedRooms.find(r => r.name === 'Kitchen');
      if (kitchen?.customized && kitchen.cost > 20000) {
        generatedRecommendations.push({
          id: 'kitchen-1',
          title: 'Optimize kitchen layout',
          description: 'Rearrange kitchen layout to improve workflow and reduce cabinet costs.',
          savings: 5000,
          valueIncrease: 8000,
          roomType: 'kitchen',
          roomId: kitchen.id,
          priority: 'high',
          category: 'cost-saving',
          liked: null,
          impact: 'immediate',
          difficulty: 'moderate',
          timeframe: 3,
          benefits: [
            'Better workflow efficiency',
            'Reduced material costs',
            'Improved functionality',
            'Enhanced resale value'
          ]
        });
      }

      // Sort recommendations
      const sortedRecommendations = sortRecommendations(generatedRecommendations, sortBy);
      
      setRecommendations(sortedRecommendations);
      setLoading(false);
    }, 1000);
  };

  const sortRecommendations = (recs: Recommendation[], sortBy: string) => {
    return [...recs].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'savings':
          const aSavings = a.savings || 0;
          const bSavings = b.savings || 0;
          return bSavings - aSavings;
        case 'roi':
          const aROI = (a.valueIncrease || 0) / (a.savings || 1);
          const bROI = (b.valueIncrease || 0) / (b.savings || 1);
          return bROI - aROI;
        case 'timeframe':
          return a.timeframe - b.timeframe;
        default:
          return 0;
      }
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost-saving':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'value-add':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'energy-efficiency':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
        return <Tool className="h-5 w-5 text-purple-500" />;
      case 'safety':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'sustainability':
        return <Leaf className="h-5 w-5 text-emerald-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'cost-saving':
        return 'Cost Saving Opportunities';
      case 'value-add':
        return 'Value Adding Improvements';
      case 'energy-efficiency':
        return 'Energy Efficiency Upgrades';
      case 'maintenance':
        return 'Maintenance & Prevention';
      case 'safety':
        return 'Safety & Code Compliance';
      case 'sustainability':
        return 'Sustainable Solutions';
      default:
        return category;
    }
  };

  const getImpactLabel = (impact: string): string => {
    switch (impact) {
      case 'immediate':
        return 'Immediate Impact';
      case 'short-term':
        return '1-6 Months';
      case 'long-term':
        return '6+ Months';
      default:
        return impact;
    }
  };

  const getDifficultyLabel = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy':
        return 'DIY Friendly';
      case 'moderate':
        return 'Some Expertise Needed';
      case 'complex':
        return 'Professional Required';
      default:
        return difficulty;
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLikeRecommendation = (id: string, liked: boolean) => {
    setRecommendations(recommendations.map(rec => 
      rec.id === id ? { ...rec, liked } : rec
    ));
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter.priority.length && !filter.priority.includes(rec.priority)) return false;
    if (filter.impact.length && !filter.impact.includes(rec.impact)) return false;
    if (filter.difficulty.length && !filter.difficulty.includes(rec.difficulty)) return false;
    return true;
  });

  const groupedRecommendations = filteredRecommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = [];
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<string, Recommendation[]>);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-medium text-gray-900">Smart Recommendations</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-gray-500"
        >
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-5 sm:px-6">
              {/* Filters and Sorting */}
              <div className="mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="priority">Priority</option>
                    <option value="savings">Potential Savings</option>
                    <option value="roi">Return on Investment</option>
                    <option value="timeframe">Implementation Time</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Impact</label>
                  <select
                    multiple
                    value={filter.impact}
                    onChange={(e) => setFilter(prev => ({
                      ...prev,
                      impact: Array.from(e.target.selectedOptions, option => option.value)
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="immediate">Immediate Impact</option>
                    <option value="short-term">Short Term (1-6 months)</option>
                    <option value="long-term">Long Term (6+ months)</option>
                  </select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Difficulty</label>
                  <select
                    multiple
                    value={filter.difficulty}
                    onChange={(e) => setFilter(prev => ({
                      ...prev,
                      difficulty: Array.from(e.target.selectedOptions, option => option.value)
                    }))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="easy">DIY Friendly</option>
                    <option value="moderate">Some Expertise Needed</option>
                    <option value="complex">Professional Required</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Generating recommendations...</span>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No recommendations available. Customize your rooms to get personalized suggestions.
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedRecommendations).map(([category, recs]) => (
                    <div key={category} className="border rounded-lg overflow-hidden">
                      <div 
                        className={`px-4 py-3 flex justify-between items-center cursor-pointer ${
                          expandedCategories.includes(category) ? 'bg-gray-50' : 'bg-white'
                        }`}
                        onClick={() => toggleCategory(category)}
                      >
                        <div className="flex items-center">
                          {getCategoryIcon(category)}
                          <h3 className="ml-2 font-medium text-gray-900">{getCategoryLabel(category)}</h3>
                          <span className="ml-2 text-sm text-gray-500">({recs.length})</span>
                        </div>
                        {expandedCategories.includes(category) ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <AnimatePresence>
                        {expandedCategories.includes(category) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="divide-y divide-gray-200">
                              {recs.map((rec) => (
                                <div key={rec.id} className="p-4 hover:bg-gray-50">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <h4 className="text-lg font-medium text-gray-900 mb-2">{rec.title}</h4>
                                      <p className="text-gray-600 mb-4">{rec.description}</p>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="space-y-2">
                                          <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                              Timeline: {rec.timeframe} days
                                            </span>
                                          </div>
                                          <div className="flex items-center">
                                            <Tool className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                              Difficulty: {getDifficultyLabel(rec.difficulty)}
                                            </span>
                                          </div>
                                          <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                              Impact: {getImpactLabel(rec.impact)}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          {rec.savings !== null && (
                                            <div className="flex items-center">
                                              <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                                              <span className="text-sm text-gray-600">
                                                Potential Savings: {formatCurrency(rec.savings)}
                                              </span>
                                            </div>
                                          )}
                                          {rec.valueIncrease !== null && (
                                            <div className="flex items-center">
                                              <TrendingUp className="h-4 w-4 text-blue-500 mr-2" />
                                              <span className="text-sm text-gray-600">
                                                Value Increase: {formatCurrency(rec.valueIncrease)}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="mt-4">
                                        <h5 className="text-sm font-medium text-gray-900 mb-2">Key Benefits:</h5>
                                        <ul className="grid grid-cols-2 gap-2">
                                          {rec.benefits.map((benefit, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-600">
                                              <Star className="h-4 w-4 text-yellow-400 mr-2" />
                                              {benefit}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {rec.risks && (
                                        <div className="mt-4 bg-red-50 p-3 rounded-md">
                                          <div className="flex items-center mb-2">
                                            <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                                            <h5 className="text-sm font-medium text-red-800">Potential Risks:</h5>
                                          </div>
                                          <ul className="list-disc pl-5 text-sm text-red-700">
                                            {rec.risks.map((risk, index) => (
                                              <li key={index}>{risk}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                      onClick={() => handleLikeRecommendation(rec.id, true)}
                                      className={`p-1.5 rounded-full ${
                                        rec.liked === true ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                      }`}
                                      title="Helpful"
                                    >
                                      <ThumbsUp className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleLikeRecommendation(rec.id, false)}
                                      className={`p-1.5 rounded-full ${
                                        rec.liked === false ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                      }`}
                                      title="Not helpful"
                                    >
                                      <ThumbsDown className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommendationEngine;