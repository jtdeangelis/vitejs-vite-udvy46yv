import { useState, useEffect } from 'react';
import { CostSettings } from '../types';

// Default material costs
const DEFAULT_MATERIAL_COSTS = {
  flooring: {
    carpet: 5,
    hardwood: 12,
    laminate: 7,
    vinyl: 4,
    tile: 8,
    marble: 25,
    concrete: 5,
    epoxy: 10
  },
  // ...other defaults...
};

// Default labor percentages
const DEFAULT_LABOR_PERCENTAGES = {
  low: 30,
  medium: 40,
  high: 50
};

/**
 * Hook to manage cost settings with localStorage persistence
 */
export function useCostSettings() {
  const [settings, setSettings] = useState<CostSettings>({
    materialCosts: DEFAULT_MATERIAL_COSTS,
    laborPercentage: DEFAULT_LABOR_PERCENTAGES.medium
  });
  
  const [loaded, setLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('costSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setLoaded(true);
    } catch (error) {
      console.error('Failed to load cost settings:', error);
      setLoaded(true);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem('costSettings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save cost settings:', error);
      }
    }
  }, [settings, loaded]);

  // Update material cost
  const updateMaterialCost = (category: string, type: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      materialCosts: {
        ...prev.materialCosts,
        [category]: {
          ...prev.materialCosts?.[category],
          [type]: value
        }
      }
    }));
  };

  // Update labor percentage
  const updateLaborPercentage = (percentage: number) => {
    setSettings(prev => ({
      ...prev,
      laborPercentage: percentage
    }));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setSettings({
      materialCosts: DEFAULT_MATERIAL_COSTS,
      laborPercentage: DEFAULT_LABOR_PERCENTAGES.medium
    });
  };

  return {
    settings,
    updateMaterialCost,
    updateLaborPercentage,
    resetToDefaults,
    isLoaded: loaded
  };
}