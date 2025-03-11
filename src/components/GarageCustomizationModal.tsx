import React, { useEffect, useState } from 'react';
import { GarageOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface GarageCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  garageOptions: GarageOptions;
  setGarageOptions: React.Dispatch<React.SetStateAction<GarageOptions>>;
  onApply: () => void;
}

// Default garage options
const defaultGarageOptions: GarageOptions = {
  flooring: { needed: false, type: 'concrete', squareFeet: 400 },
  paint: { needed: false, type: 'standard', squareFeet: 800, finish: 'flat' },
  doors: { needed: false, type: 'basic', count: 2 },
  storage: { needed: false, type: 'shelving', linearFeet: 12 },
  electrical: { needed: false, type: 'basic' },
  lighting: { needed: false, type: 'basic', count: 4 },
  dimensions: { length: 20, width: 20 },
  notes: '',
  customLineItems: []
};

const GarageCustomizationModal: React.FC<GarageCustomizationModalProps> = ({
  isOpen,
  onClose,
  garageOptions: initialGarageOptions,
  setGarageOptions,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<GarageOptions>({
    ...defaultGarageOptions,
    ...initialGarageOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultGarageOptions,
      ...initialGarageOptions
    });
  }, [initialGarageOptions]);

  const flooringOptions = [
    { value: 'concrete', label: 'Concrete', price: 5 },
    { value: 'epoxy', label: 'Epoxy', price: 10 },
    { value: 'tile', label: 'Tile', price: 8 }
  ];

  const paintOptions = [
    { value: 'standard', label: 'Standard Paint', price: 0.75 },
    { value: 'premium', label: 'Premium Paint', price: 1.5 }
  ];

  const paintFinishOptions = [
    { value: 'flat', label: 'Flat', description: 'Best for ceilings and low-traffic areas' },
    { value: 'eggshell', label: 'Eggshell', description: 'Good for walls with a subtle sheen' },
    { value: 'satin', label: 'Satin', description: 'Ideal for high-traffic areas' },
    { value: 'semiGloss', label: 'Semi-Gloss', description: 'Best for trim and high-moisture areas' }
  ];

  const doorOptions = [
    { value: 'basic', label: 'Basic', price: 1500 },
    { value: 'insulated', label: 'Insulated', price: 2500 },
    { value: 'premium', label: 'Premium', price: 4000 }
  ];

  const storageOptions = [
    { value: 'shelving', label: 'Shelving', price: 50 },
    { value: 'cabinets', label: 'Cabinets', price: 150 },
    { value: 'custom', label: 'Custom', price: 250 }
  ];

  const electricalOptions = [
    { value: 'basic', label: 'Basic', price: 1000 },
    { value: 'upgraded', label: 'Upgraded', price: 2500 }
  ];

  const lightingOptions = [
    { value: 'basic', label: 'Basic', price: 100 },
    { value: 'led', label: 'LED', price: 150 },
    { value: 'motion', label: 'Motion Sensor', price: 200 }
  ];

  useEffect(() => {
    if (!localOptions.dimensions) return;
    
    const area = localOptions.dimensions.length * localOptions.dimensions.width;
    const perimeter = 2 * (localOptions.dimensions.length + localOptions.dimensions.width);
    const wallHeight = 10; // Standard 10' garage ceiling height
    const wallArea = perimeter * wallHeight;
    
    let updates = {};
    let hasUpdates = false;

    if (localOptions.flooring?.needed) {
      updates = {
        ...updates,
        flooring: {
          ...localOptions.flooring,
          squareFeet: area
        }
      };
      hasUpdates = true;
    }

    if (localOptions.paint?.needed) {
      updates = {
        ...updates,
        paint: {
          ...localOptions.paint,
          squareFeet: wallArea
        }
      };
      hasUpdates = true;
    }

    if (localOptions.storage?.needed) {
      updates = {
        ...updates,
        storage: {
          ...localOptions.storage,
          linearFeet: Math.min(perimeter * 0.4, 20) // Max 20ft or 40% of perimeter
        }
      };
      hasUpdates = true;
    }

    if (hasUpdates) {
      const updatedOptions = {
        ...localOptions,
        ...updates
      };
      setLocalOptions(updatedOptions);
      setGarageOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed,
    localOptions.storage?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<GarageOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setGarageOptions(updatedOptions);
  };

  const handleFlooringToggle = (needed: boolean) => {
    handleUpdateOptions({
      flooring: {
        ...localOptions.flooring,
        needed
      }
    });
  };

  const handlePaintToggle = (needed: boolean) => {
    handleUpdateOptions({
      paint: {
        ...localOptions.paint,
        needed
      }
    });
  };

  const handleDoorsToggle = (needed: boolean) => {
    handleUpdateOptions({
      doors: {
        ...localOptions.doors,
        needed
      }
    });
  };

  const handleStorageToggle = (needed: boolean) => {
    handleUpdateOptions({
      storage: {
        ...localOptions.storage,
        needed
      }
    });
  };

  const handleElectricalToggle = (needed: boolean) => {
    handleUpdateOptions({
      electrical: {
        ...localOptions.electrical,
        needed
      }
    });
  };

  const handleLightingToggle = (needed: boolean) => {
    handleUpdateOptions({
      lighting: {
        ...localOptions.lighting,
        needed
      }
    });
  };

  const handleUpdateNotes = (notes: string) => {
    handleUpdateOptions({ notes });
  };

  const handleUpdateLineItems = (customLineItems: CustomLineItem[]) => {
    handleUpdateOptions({ customLineItems });
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title="Garage Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Garage Dimensions"
          length={localOptions.dimensions.length}
          width={localOptions.dimensions.width}
          onLengthChange={(length) => handleUpdateOptions({
            dimensions: {
              ...localOptions.dimensions,
              length
            }
          })}
          onWidthChange={(width) => handleUpdateOptions({
            dimensions: {
              ...localOptions.dimensions,
              width
            }
          })}
        />
      </div>
      
      <div className="space-y-8">
        <OptionGroup
          title="Paint"
          isNeeded={localOptions.paint?.needed || false}
          onToggleNeeded={handlePaintToggle}
          selectedType={localOptions.paint?.type || 'standard'}
          onTypeChange={(type) => handleUpdateOptions({
            paint: {
              ...localOptions.paint,
              type
            }
          })}
          options={paintOptions}
          isPaintGroup={true}
          paintFinish={localOptions.paint?.finish || 'flat'}
          onPaintFinishChange={(finish) => handleUpdateOptions({
            paint: {
              ...localOptions.paint,
              finish
            }
          })}
        >
          {localOptions.paint?.needed && (
            <MaterialInput
              label="Wall Area to Paint"
              value={localOptions.paint.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                paint: {
                  ...localOptions.paint,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="garage"
              measurementType="paint"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Flooring"
          isNeeded={localOptions.flooring.needed}
          onToggleNeeded={handleFlooringToggle}
          selectedType={localOptions.flooring.type}
          onTypeChange={(type) => handleUpdateOptions({
            flooring: {
              ...localOptions.flooring,
              type: type as 'concrete' | 'epoxy' | 'tile'
            }
          })}
          options={flooringOptions}
        >
          {localOptions.flooring.needed && (
            <MaterialInput
              label="Square Feet of Flooring"
              value={localOptions.flooring.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                flooring: {
                  ...localOptions.flooring,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="garage"
              measurementType="flooring"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Doors"
          isNeeded={localOptions.doors.needed}
          onToggleNeeded={handleDoorsToggle}
          selectedType={localOptions.doors.type}
          onTypeChange={(type) => handleUpdateOptions({
            doors: {
              ...localOptions.doors,
              type: type as 'basic' | 'insulated' | 'premium'
            }
          })}
          options={doorOptions}
        >
          {localOptions.doors.needed && (
            <CountInput
              label="Number of Garage Doors"
              count={localOptions.doors.count}
              setCount={(count) => handleUpdateOptions({
                doors: {
                  ...localOptions.doors,
                  count
                }
              })}
              min={1}
              max={4}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Storage"
          isNeeded={localOptions.storage.needed}
          onToggleNeeded={handleStorageToggle}
          selectedType={localOptions.storage.type}
          onTypeChange={(type) => handleUpdateOptions({
            storage: {
              ...localOptions.storage,
              type: type as 'shelving' | 'cabinets' | 'custom'
            }
          })}
          options={storageOptions}
        >
          {localOptions.storage.needed && (
            <MaterialInput
              label="Linear Feet of Storage"
              value={localOptions.storage.linearFeet}
              onChange={(linearFeet) => handleUpdateOptions({
                storage: {
                  ...localOptions.storage,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="garage"
              measurementType="storage"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Electrical"
          isNeeded={localOptions.electrical.needed}
          onToggleNeeded={handleElectricalToggle}
          selectedType={localOptions.electrical.type}
          onTypeChange={(type) => handleUpdateOptions({
            electrical: {
              ...localOptions.electrical,
              type: type as 'basic' | 'upgraded'
            }
          })}
          options={electricalOptions}
        />

        <OptionGroup
          title="Lighting"
          isNeeded={localOptions.lighting.needed}
          onToggleNeeded={handleLightingToggle}
          selectedType={localOptions.lighting.type}
          onTypeChange={(type) => handleUpdateOptions({
            lighting: {
              ...localOptions.lighting,
              type: type as 'basic' | 'led' | 'motion'
            }
          })}
          options={lightingOptions}
        >
          {localOptions.lighting.needed && (
            <CountInput
              label="Number of Light Fixtures"
              count={localOptions.lighting.count}
              setCount={(count) => handleUpdateOptions({
                lighting: {
                  ...localOptions.lighting,
                  count
                }
              })}
              min={1}
              max={12}
            />
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default GarageCustomizationModal;