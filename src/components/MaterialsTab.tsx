import React, { useState, useMemo, useCallback } from 'react';
import { Room, IndividualRoom } from '../types';
import { useCostSettings } from '../context/CostSettingsContext';
import { formatCurrency } from '../utils/formatters';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { debounce } from 'lodash';
import { 
  Package, 
  DollarSign, 
  Wrench, 
  PaintBucket, 
  Droplet,
  Warehouse,
  TrendingUp,
  Calendar,
  Truck,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Filter,
  Timer
} from 'lucide-react';

interface MaterialsTabProps {
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
}

interface MaterialStats {
  totalQuantity: number;
  averagePrice: number;
  roomCount: number;
  estimatedDeliveryDays: number;
}

interface MaterialFilter {
  category: string[];
  priceRange: [number, number];
  rooms: string[];
  searchTerm: string;
}

// Helper functions
const calculateDeliveryDays = (category: string): number => {
  const deliveryTimes: Record<string, number> = {
    flooring: 14,
    paint: 3,
    plumbing: 7,
    electrical: 5,
    appliances: 21,
    cabinets: 28,
    countertops: 21,
    windows: 30,
    doors: 14
  };
  return deliveryTimes[category] || 7;
};

const calculateInstallTime = (category: string, quantity: number): string => {
  const baseTime: Record<string, number> = {
    flooring: 0.5, // hours per sq ft
    paint: 0.2,
    plumbing: 4,
    electrical: 2,
    appliances: 3,
    cabinets: 2,
    countertops: 4,
    windows: 3,
    doors: 2
  };
  
  const hours = (baseTime[category] || 1) * quantity;
  return hours < 24 ? `${Math.ceil(hours)} hours` : `${Math.ceil(hours / 8)} days`;
};

const requiresSpecialHandling = (category: string, type: string): boolean => {
  const specialHandlingItems = {
    countertops: ['marble', 'granite', 'quartz'],
    appliances: ['refrigerator', 'range', 'dishwasher'],
    windows: ['custom', 'bay', 'picture'],
    flooring: ['marble', 'hardwood']
  };
  
  return specialHandlingItems[category]?.includes(type) || false;
};

const getAlternativeOptions = (category: string, type: string, settings: any) => {
  if (!settings[category]) return [];
  
  return Object.entries(settings[category])
    .filter(([key]) => key !== type)
    .map(([key, value]) => ({
      type: key,
      price: value
    }))
    .slice(0, 3);
};

const getSupplierInfo = (category: string, type: string) => {
  const suppliers = {
    flooring: {
      standard: { name: 'FloorMaster Supply', leadTime: '7-10 days' },
      premium: { name: 'Luxury Flooring Co', leadTime: '14-21 days' }
    },
    paint: {
      standard: { name: 'Paint Pro Supply', leadTime: '2-3 days' },
      premium: { name: 'Designer Paint Co', leadTime: '5-7 days' }
    },
    plumbing: {
      standard: { name: 'Plumbing Supply Co', leadTime: '3-5 days' },
      premium: { name: 'Premium Plumbing', leadTime: '7-10 days' }
    }
  };
  
  return suppliers[category]?.[type] || { name: 'General Supplier', leadTime: '5-7 days' };
};

const MaterialsTab: React.FC<MaterialsTabProps> = ({
  fixedRooms,
  bedrooms,
  bathrooms,
  customRooms
}) => {
  const { settings } = useCostSettings();
  const [filters, setFilters] = useState<MaterialFilter>({
    category: [],
    priceRange: [0, Infinity],
    rooms: [],
    searchTerm: ''
  });
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'total', direction: 'desc' });
  const [showFilters, setShowFilters] = useState(false);

  // Cache for cell measurements
  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100
  });

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters(prev => ({ ...prev, searchTerm: value }));
    }, 300),
    []
  );

  // Combine all rooms
  const allRooms = [...fixedRooms, ...bedrooms, ...bathrooms, ...customRooms];

  // Calculate materials needed by category with enhanced details
  const materialsByCategory = useMemo(() => {
    return allRooms.reduce((acc, room) => {
      if (!room.customized || !room.options) return acc;

      Object.entries(room.options).forEach(([category, details]: [string, any]) => {
        if (details?.needed && details.type) {
          if (!acc[category]) {
            acc[category] = {
              total: 0,
              items: {},
              stats: {
                totalQuantity: 0,
                averagePrice: 0,
                roomCount: 0,
                estimatedDeliveryDays: calculateDeliveryDays(category)
              }
            };
          }

          const quantity = details.squareFeet || details.linearFeet || details.count || 1;
          const unitPrice = settings[category]?.[details.type] || 0;
          const itemKey = `${details.type}-${room.name}`;

          acc[category].items[itemKey] = {
            room: room.name,
            type: details.type,
            quantity,
            unitPrice,
            total: quantity * unitPrice,
            estimatedInstallTime: calculateInstallTime(category, quantity),
            requiresSpecialHandling: requiresSpecialHandling(category, details.type),
            alternativeOptions: getAlternativeOptions(category, details.type, settings),
            supplierInfo: getSupplierInfo(category, details.type)
          };

          acc[category].total += quantity * unitPrice;
          acc[category].stats.totalQuantity += quantity;
          acc[category].stats.roomCount++;
        }
      });

      return acc;
    }, {} as Record<string, { 
      total: number; 
      items: Record<string, any>;
      stats: MaterialStats;
    }>);
  }, [allRooms, settings]);

  // Apply filters and sorting
  const filteredMaterials = useMemo(() => {
    let filtered = { ...materialsByCategory };

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = Object.entries(filtered).reduce((acc, [category, data]) => {
        if (filters.category.includes(category)) {
          acc[category] = data;
        }
        return acc;
      }, {} as typeof materialsByCategory);
    }

    // Apply price range filter
    filtered = Object.entries(filtered).reduce((acc, [category, data]) => {
      const filteredItems = Object.entries(data.items).reduce((itemAcc, [key, item]) => {
        if (item.total >= filters.priceRange[0] && item.total <= filters.priceRange[1]) {
          itemAcc[key] = item;
        }
        return itemAcc;
      }, {} as Record<string, any>);

      if (Object.keys(filteredItems).length > 0) {
        acc[category] = {
          ...data,
          items: filteredItems,
          total: Object.values(filteredItems).reduce((sum: number, item: any) => sum + item.total, 0)
        };
      }
      return acc;
    }, {} as typeof materialsByCategory);

    // Apply room filter
    if (filters.rooms.length > 0) {
      filtered = Object.entries(filtered).reduce((acc, [category, data]) => {
        const filteredItems = Object.entries(data.items).reduce((itemAcc, [key, item]) => {
          if (filters.rooms.includes(item.room)) {
            itemAcc[key] = item;
          }
          return itemAcc;
        }, {} as Record<string, any>);

        if (Object.keys(filteredItems).length > 0) {
          acc[category] = {
            ...data,
            items: filteredItems,
            total: Object.values(filteredItems).reduce((sum: number, item: any) => sum + item.total, 0)
          };
        }
        return acc;
      }, {} as typeof materialsByCategory);
    }

    // Apply search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [category, data]) => {
        const filteredItems = Object.entries(data.items).reduce((itemAcc, [key, item]) => {
          if (
            item.room.toLowerCase().includes(searchLower) ||
            item.type.toLowerCase().includes(searchLower) ||
            category.toLowerCase().includes(searchLower)
          ) {
            itemAcc[key] = item;
          }
          return itemAcc;
        }, {} as Record<string, any>);

        if (Object.keys(filteredItems).length > 0) {
          acc[category] = {
            ...data,
            items: filteredItems,
            total: Object.values(filteredItems).reduce((sum: number, item: any) => sum + item.total, 0)
          };
        }
        return acc;
      }, {} as typeof materialsByCategory);
    }

    return filtered;
  }, [materialsByCategory, filters]);

  const totalMaterialsCost = useMemo(() => 
    Object.values(filteredMaterials).reduce((sum, category) => sum + category.total, 0),
    [filteredMaterials]
  );

  const uniqueRooms = useMemo(() => 
    Array.from(new Set(allRooms.map(room => room.name))),
    [allRooms]
  );

  const formatCategoryName = (name: string) => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'flooring':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'paint':
        return <PaintBucket className="h-5 w-5 text-green-500" />;
      case 'plumbing':
        return <Droplet className="h-5 w-5 text-cyan-500" />;
      case 'electrical':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case 'appliances':
        return <Warehouse className="h-5 w-5 text-purple-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportMaterialsList = () => {
    const csv = [
      ['Category', 'Room', 'Type', 'Quantity', 'Unit Price', 'Total', 'Estimated Install Time', 'Special Handling'],
      ...Object.entries(filteredMaterials).flatMap(([category, data]) =>
        Object.values(data.items).map(item => [
          formatCategoryName(category),
          item.room,
          formatCategoryName(item.type),
          item.quantity,
          item.unitPrice,
          item.total,
          item.estimatedInstallTime,
          item.requiresSpecialHandling ? 'Yes' : 'No'
        ])
      )
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'materials-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Row renderer for virtualized list
  const rowRenderer = useCallback(({ index, key, style, parent, data }: any) => {
    const [category, categoryData] = data[index];
    
    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        <div style={style} className="mb-8 last:mb-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {getCategoryIcon(category)}
              <h3 className="ml-2 text-lg font-medium text-gray-900">
                {formatCategoryName(category)}
              </h3>
              <span className="ml-2 text-sm text-gray-500">
                ({Object.keys(categoryData.items).length} items)
              </span>
            </div>
            <span className="text-lg font-medium text-blue-600">
              {formatCurrency(categoryData.total)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(categoryData.items).map((item: any, itemIndex: number) => (
                  <tr key={itemIndex} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.room}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCategoryName(item.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center" title="Estimated Install Time">
                          <Timer className="h-4 w-4 mr-1" />
                          {item.estimatedInstallTime}
                        </div>
                        {item.requiresSpecialHandling && (
                          <div className="flex items-center text-amber-600" title="Requires Special Handling">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Special
                          </div>
                        )}
                        <div className="flex items-center" title="Lead Time">
                          <Truck className="h-4 w-4 mr-1" />
                          {item.supplierInfo.leadTime}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Category Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {formatCurrency(categoryData.total)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CellMeasurer>
    );
  }, []);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Materials Summary</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button
              onClick={exportMaterialsList}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-blue-900">Total Cost</h3>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalMaterialsCost)}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-green-900">Categories</h3>
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-600">{Object.keys(filteredMaterials).length}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-purple-900">Rooms</h3>
              <Warehouse className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{uniqueRooms.length}</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-yellow-900">Lead Time</h3>
              <Timer className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-yellow-600">
              {Math.max(...Object.values(materialsByCategory).map(cat => cat.stats.estimatedDeliveryDays))} days
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search materials..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <select
                multiple
                value={filters.category}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters(prev => ({ ...prev, category: values }));
                }}
                className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(materialsByCategory).map(category => (
                  <option key={category} value={category}>
                    {formatCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rooms
              </label>
              <select
                multiple
                value={filters.rooms}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setFilters(prev => ({ ...prev, rooms: values }));
                }}
                className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {uniqueRooms.map(room => (
                  <option key={room} value={room}>{room}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [parseFloat(e.target.value) || 0, prev.priceRange[1]]
                  }))}
                  className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.priceRange[1] === Infinity ? '' : filters.priceRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseFloat(e.target.value) || Infinity]
                  }))}
                  className="block w-full sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Materials List with virtualization */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-5 sm:p-6" style={{ height: '800px' }}>
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowCount={Object.entries(filteredMaterials).length}
                rowHeight={cache.rowHeight}
                deferredMeasurementCache={cache}
                rowRenderer={(props) => rowRenderer({
                  ...props,
                  data: Object.entries(filteredMaterials)
                })}
                overscanRowCount={3}
              />
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};

export default MaterialsTab;