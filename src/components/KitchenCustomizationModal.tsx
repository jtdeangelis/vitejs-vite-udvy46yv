import React, { useEffect, useState } from 'react';
import { KitchenOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface KitchenCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  kitchenOptions: KitchenOptions;
  setKitchenOptions: React.Dispatch<React.SetStateAction<KitchenOptions>>;
  onApply: () => void;
}

// Default kitchen options
const defaultKitchenOptions: KitchenOptions = {
  cabinets: { needed: false, type: 'stock', linearFeet: 30 },
  countertops: { needed: false, type: 'laminate', squareFeet: 60 },
  flooring: { needed: false, type: 'vinyl', squareFeet: 150 },
  paint: { needed: false, type: 'standard', squareFeet: 400, finish: 'semiGloss' },
  appliances: { needed: false, type: 'basic' },
  backsplash: { needed: false, type: 'ceramic', squareFeet: 30 },
  trim: { needed: false, type: 'baseboards', linearFeet: 60 },
  dimensions: { length: 15, width: 10 },
  notes: '',
  customLineItems: []
};

const KitchenCustomizationModal: React.FC<KitchenCustomizationModalProps> = ({
  isOpen,
  onClose,
  kitchenOptions: initialKitchenOptions,
  setKitchenOptions,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<KitchenOptions>({
    ...defaultKitchenOptions,
    ...initialKitchenOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultKitchenOptions,
      ...initialKitchenOptions
    });
  }, [initialKitchenOptions]);

  const flooringOptions = [
    { value: 'vinyl', label: 'Vinyl', price: 4 },
    { value: 'tile', label: 'Tile', price: 8 },
    { value: 'hardwood', label: 'Hardwood', price: 12 },
    { value: 'engineered-hardwood', label: 'Engineered Hardwood', price: 10 }
  ];

  const paintOptions = [
    { value: 'standard', label: 'Standard Paint', price: 0.75 },
    { value: 'premium', label: 'Premium Paint', price: 1.5 }
  ];

  const paintFinishOptions = [
    { value: 'flat', label: 'Flat', description: 'Best for ceilings' },
    { value: 'eggshell', label: 'Eggshell', description: 'Good for low-traffic walls' },
    { value: 'satin', label: 'Satin', description: 'Ideal for kitchens and high-traffic areas' },
    { value: 'semiGloss', label: 'Semi-Gloss', description: 'Best for trim and cabinets' }
  ];

  const cabinetOptions = [
    { value: 'stock', label: 'Stock', price: 200 },
    { value: 'semi-custom', label: 'Semi-Custom', price: 350 },
    { value: 'custom', label: 'Custom', price: 500 }
  ];

  const countertopOptions = [
    { value: 'laminate', label: 'Laminate', price: 30 },
    { value: 'quartz', label: 'Quartz', price: 75 },
    { value: 'granite', label: 'Granite', price: 100 },
    { value: 'marble', label: 'Marble', price: 125 }
  ];

  const applianceOptions = [
    { value: 'basic', label: 'Basic', price: 3000 },
    { value: 'mid-range', label: 'Mid-Range', price: 6000 },
    { value: 'high-end', label: 'High-End', price: 10000 }
  ];

  const backsplashOptions = [
    { value: 'ceramic', label: 'Ceramic', price: 15 },
    { value: 'glass', label: 'Glass', price: 25 },
    { value: 'stone', label: 'Stone', price: 35 }
  ];

  const trimOptions = [
    { value: 'baseboards', label: 'Baseboards', price: 5 },
    { value: 'crown', label: 'Crown Molding', price: 7 },
    { value: 'both', label: 'Both', price: 12 }
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
          linearFeet: perimeter * 0.75 // Assume cabinets on 75% of walls
        }
      };
      hasUpdates = true;
    }

    if (localOptions.countertops?.needed) {
      updates = {
        ...updates,
        countertops: {
          ...localOptions.countertops,
          squareFeet: perimeter * 2 // Standard 2' depth
        }
      };
      hasUpdates = true;
    }

    if (localOptions.backsplash?.needed) {
      updates = {
        ...updates,
        backsplash: {
          ...localOptions.backsplash,
          squareFeet: perimeter * 1.5 // Standard 18" backsplash height
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
      setKitchenOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed,
    localOptions.cabinets?.needed,
    localOptions.countertops?.needed,
    localOptions.backsplash?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<KitchenOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setKitchenOptions(updatedOptions);
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

  const handleAppliancesToggle = (needed: boolean) => {
    handleUpdateOptions({
      appliances: {
        ...localOptions.appliances,
        needed
      }
    });
  };

  const handleBacksplashToggle = (needed: boolean) => {
    handleUpdateOptions({
      backsplash: {
        ...localOptions.backsplash,
        needed
      }
    });
  };

  const handleTrimToggle = (needed: boolean) => {
    handleUpdateOptions({
      trim: {
        ...localOptions.trim,
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
      title="Kitchen Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Kitchen Dimensions"
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
          paintFinish={localOptions.paint?.finish || 'semiGloss'}
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
              roomType="kitchen"
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
              type: type as 'vinyl' | 'tile' | 'hardwood' | 'engineered-hardwood'
            }
          })}
          options={flooringOptions}
          showInstallType={true}
          installType={localOptions.flooring.installType}
          onInstallTypeChange={(installType) => handleUpdateOptions({
            flooring: {
              ...localOptions.flooring,
              installType
            }
          })}
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
              roomType="kitchen"
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
              type: type as 'stock' | 'semi-custom' | 'custom'
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
              roomType="kitchen"
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
              type: type as 'laminate' | 'quartz' | 'granite' | 'marble'
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
              roomType="kitchen"
              measurementType="countertops"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Appliances"
          isNeeded={localOptions.appliances.needed}
          onToggleNeeded={handleAppliancesToggle}
          selectedType={localOptions.appliances.type}
          onTypeChange={(type) => handleUpdateOptions({
            appliances: {
              ...localOptions.appliances,
              type: type as 'basic' | 'mid-range' | 'high-end'
            }
          })}
          options={applianceOptions}
        />

        <OptionGroup
          title="Backsplash"
          isNeeded={localOptions.backsplash.needed}
          onToggleNeeded={handleBacksplashToggle}
          selectedType={localOptions.backsplash.type}
          onTypeChange={(type) => handleUpdateOptions({
            backsplash: {
              ...localOptions.backsplash,
              type: type as 'ceramic' | 'glass' | 'stone'
            }
          })}
          options={backsplashOptions}
        >
          {localOptions.backsplash.needed && (
            <MaterialInput
              label="Square Feet of Backsplash"
              value={localOptions.backsplash.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                backsplash: {
                  ...localOptions.backsplash,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="kitchen"
              measurementType="backsplash"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Trim"
          isNeeded={localOptions.trim.needed}
          onToggleNeeded={handleTrimToggle}
          selectedType={localOptions.trim.type}
          onTypeChange={(type) => handleUpdateOptions({
            trim: {
              ...localOptions.trim,
              type: type as 'baseboards' | 'crown' | 'both'
            }
          })}
          options={trimOptions}
        >
          {localOptions.trim.needed && (
            <MaterialInput
              label="Linear Feet of Trim"
              value={localOptions.trim.linearFeet}
              onChange={(linearFeet) => handleUpdateOptions({
                trim: {
                  ...localOptions.trim,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="kitchen"
              measurementType="trim"
            />
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default KitchenCustomizationModal;