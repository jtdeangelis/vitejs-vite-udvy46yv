import React, { useEffect, useState } from 'react';
import { LaundryRoomOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';

interface LaundryRoomCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  laundryRoomOptions: LaundryRoomOptions;
  setLaundryRoomOptions: React.Dispatch<React.SetStateAction<LaundryRoomOptions>>;
  onApply: () => void;
}

// Default laundry room options
const defaultLaundryRoomOptions: LaundryRoomOptions = {
  flooring: { needed: false, type: 'vinyl', squareFeet: 48 },
  paint: { needed: false, type: 'standard', squareFeet: 200, finish: 'flat' },
  cabinets: { needed: false, type: 'basic', linearFeet: 6 },
  countertops: { needed: false, type: 'laminate', squareFeet: 12 },
  sink: { needed: false, type: 'utility' },
  appliances: { needed: false, type: 'basic' },
  dimensions: { length: 8, width: 6 },
  notes: '',
  customLineItems: []
};

const LaundryRoomCustomizationModal: React.FC<LaundryRoomCustomizationModalProps> = ({
  isOpen,
  onClose,
  laundryRoomOptions: initialLaundryRoomOptions,
  setLaundryRoomOptions,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<LaundryRoomOptions>({
    ...defaultLaundryRoomOptions,
    ...initialLaundryRoomOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultLaundryRoomOptions,
      ...initialLaundryRoomOptions
    });
  }, [initialLaundryRoomOptions]);

  const flooringOptions = [
    { value: 'vinyl', label: 'Vinyl', price: 4 },
    { value: 'tile', label: 'Tile', price: 8 },
    { value: 'laminate', label: 'Laminate', price: 7 }
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

  const cabinetOptions = [
    { value: 'basic', label: 'Basic', price: 150 },
    { value: 'custom', label: 'Custom', price: 350 }
  ];

  const countertopOptions = [
    { value: 'laminate', label: 'Laminate', price: 30 },
    { value: 'quartz', label: 'Quartz', price: 75 }
  ];

  const sinkOptions = [
    { value: 'utility', label: 'Utility', price: 400 },
    { value: 'deep', label: 'Deep', price: 700 },
    { value: 'farmhouse', label: 'Farmhouse', price: 1200 }
  ];

  const applianceOptions = [
    { value: 'basic', label: 'Basic', price: 1500 },
    { value: 'energy-efficient', label: 'Energy-Efficient', price: 2500 },
    { value: 'premium', label: 'Premium', price: 3500 }
  ];

  useEffect(() => {
    if (!localOptions.dimensions) return;
    
    const area = localOptions.dimensions.length * localOptions.dimensions.width;
    const perimeter = 2 * (localOptions.dimensions.length + localOptions.dimensions.width);
    const wallHeight = 8; // Standard 8' ceiling height
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

    if (localOptions.cabinets?.needed) {
      updates = {
        ...updates,
        cabinets: {
          ...localOptions.cabinets,
          linearFeet: Math.min(perimeter * 0.5, 10) // Max 10ft or 50% of perimeter
        }
      };
      hasUpdates = true;
    }

    if (localOptions.countertops?.needed) {
      updates = {
        ...updates,
        countertops: {
          ...localOptions.countertops,
          squareFeet: localOptions.cabinets?.linearFeet * 2 || 12 // 2ft depth
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
      setLaundryRoomOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed,
    localOptions.cabinets?.needed,
    localOptions.countertops?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<LaundryRoomOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setLaundryRoomOptions(updatedOptions);
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

  const handleCabinetsToggle = (needed: boolean) => {
    handleUpdateOptions({
      cabinets: {
        ...localOptions.cabinets,
        needed
      }
    });
  };

  const handleCountertopsToggle = (needed: boolean) => {
    handleUpdateOptions({
      countertops: {
        ...localOptions.countertops,
        needed
      }
    });
  };

  const handleSinkToggle = (needed: boolean) => {
    handleUpdateOptions({
      sink: {
        ...localOptions.sink,
        needed
      }
    });
  };

  const handleAppliancesToggle = (needed: boolean) => {
    handleUpdateOptions({
      appliances: {
        ...localOptions.appliances,
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
      title="Laundry Room Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Laundry Room Dimensions"
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
              roomType="laundry"
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
              type: type as 'vinyl' | 'tile' | 'laminate'
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
              roomType="laundry"
              measurementType="flooring"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Cabinets"
          isNeeded={localOptions.cabinets.needed}
          onToggleNeeded={handleCabinetsToggle}
          selectedType={localOptions.cabinets.type}
          onTypeChange={(type) => handleUpdateOptions({
            cabinets: {
              ...localOptions.cabinets,
              type: type as 'basic' | 'custom'
            }
          })}
          options={cabinetOptions}
        >
          {localOptions.cabinets.needed && (
            <MaterialInput
              label="Linear Feet of Cabinets"
              value={localOptions.cabinets.linearFeet}
              onChange={(linearFeet) => handleUpdateOptions({
                cabinets: {
                  ...localOptions.cabinets,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="laundry"
              measurementType="cabinets"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Countertops"
          isNeeded={localOptions.countertops.needed}
          onToggleNeeded={handleCountertopsToggle}
          selectedType={localOptions.countertops.type}
          onTypeChange={(type) => handleUpdateOptions({
            countertops: {
              ...localOptions.countertops,
              type: type as 'laminate' | 'quartz'
            }
          })}
          options={countertopOptions}
        >
          {localOptions.countertops.needed && (
            <MaterialInput
              label="Square Feet of Countertops"
              value={localOptions.countertops.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                countertops: {
                  ...localOptions.countertops,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="laundry"
              measurementType="countertops"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Sink"
          isNeeded={localOptions.sink.needed}
          onToggleNeeded={handleSinkToggle}
          selectedType={localOptions.sink.type}
          onTypeChange={(type) => handleUpdateOptions({
            sink: {
              ...localOptions.sink,
              type: type as 'utility' | 'deep' | 'farmhouse'
            }
          })}
          options={sinkOptions}
        />

        <OptionGroup
          title="Appliances"
          isNeeded={localOptions.appliances.needed}
          onToggleNeeded={handleAppliancesToggle}
          selectedType={localOptions.appliances.type}
          onTypeChange={(type) => handleUpdateOptions({
            appliances: {
              ...localOptions.appliances,
              type: type as 'basic' | 'energy-efficient' | 'premium'
            }
          })}
          options={applianceOptions}
        />
      </div>
    </ModalTemplate>
  );
};

export default LaundryRoomCustomizationModal;