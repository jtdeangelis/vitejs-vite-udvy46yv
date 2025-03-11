import React, { createContext, useContext, useEffect, useState } from 'react';
import { COSTS } from '../utils/costConstants';
import { debounce } from 'lodash';

export type CostSettings = typeof COSTS;

interface CostSettingsContextType {
  settings: CostSettings;
  updateCategoryPrice: (category: string, type: string, price: number) => void;
  updateNestedCategoryPrice: (category: string, subCategory: string, type: string, price: number) => void;
  resetToDefaults: () => void;
  isLoaded: boolean;
}

const CostSettingsContext = createContext<CostSettingsContextType | undefined>(undefined);

export const CostSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CostSettings>(COSTS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('costSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load cost settings:', error);
      setIsLoaded(true);
    }
  }, []);

  const debouncedSave = debounce((newSettings: CostSettings) => {
    try {
      localStorage.setItem('costSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save cost settings:', error);
    }
  }, 1000);

  useEffect(() => {
    if (isLoaded) {
      debouncedSave(settings);
    }
    return () => {
      debouncedSave.cancel();
    };
  }, [settings, isLoaded]);

  const updateCategoryPrice = (category: string, type: string, price: number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: price
      }
    }));
  };

  const updateNestedCategoryPrice = (category: string, subCategory: string, type: string, price: number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...prev[category][subCategory],
          [type]: price
        }
      }
    }));
  };

  const resetToDefaults = () => {
    setSettings(COSTS);
  };

  return (
    <CostSettingsContext.Provider value={{
      settings,
      updateCategoryPrice,
      updateNestedCategoryPrice,
      resetToDefaults,
      isLoaded
    }}>
      {children}
    </CostSettingsContext.Provider>
  );
};

export const useCostSettings = () => {
  const context = useContext(CostSettingsContext);
  if (context === undefined) {
    throw new Error('useCostSettings must be used within a CostSettingsProvider');
  }
  return context;
};