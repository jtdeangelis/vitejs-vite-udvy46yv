import React, { useEffect, useState } from 'react';
import { FoyerOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface FoyerCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  foyerOptions: FoyerOptions;
  setFoyerOptions: React.Dispatch<React.SetStateAction<FoyerOptions>>;
  onApply: () => void;
}

// Default foyer options
const defaultFoyerOptions: FoyerOptions = {
  flooring: { needed: false, type: 'tile', squareFeet: 64 },
  paint: { needed: false, type: 'standard', squareFeet: 300, finish: 'flat' },
  lighting: { needed: false, type: 'pendant', count: 1 },
  closet: { needed: false, type: 'basic', squareFeet: 8 },
  stairs: { needed: false, type: 'carpet', linearFeet: 12 },
  dimensions: { length: 8, width: 8 },
  notes: '',
  customLineItems: []
};

const FoyerCustomizationModal: React.FC<FoyerCustomizationModalProps> = ({
  isOpen,
  onClose,
  foyerOptions: initialFoyerOptions,
  setFoyerOptions,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<FoyerOptions>({
    ...defaultFoyerOptions,
    ...initialFoyerOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultFoyerOptions,
      ...initialFoyerOptions
    });
  }, [initialFoyerOptions]);

  const flooringOptions = [
    { value: 'tile', label: 'Tile', price: 8 },
    { value: 'hardwood', label: 'Hardwood', price: 12 },
    { value: 'engineered-hardwood', label: 'Engineered Hardwood', price: 10 },
    { value: 'marble', label: 'Marble', price: 25 }
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

  const lightingOptions = [
    { value: 'pendant', label: 'Pendant', price: 250 },
    { value: 'chandelier', label: 'Chandelier', price: 800 },
    { value: 'recessed', label: 'Recessed', price: 200 }
  ];

  const closetOptions = [
    { value: 'basic', label: 'Basic', price: 800 },
    { value: 'custom', label: 'Custom', price: 2000 }
  ];

  const stairsOptions = [
    { value: 'carpet', label: 'Carpet', price: 100 },
    { value: 'hardwood', label: 'Hardwood', price: 250 },
    { value: 'refinish', label: 'Refinish Existing', price: 150 }
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

    if (hasUpdates) {
      const updatedOptions = {
        ...localOptions,
        ...updates
      };
      setLocalOptions(updatedOptions);
      setFoyerOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<FoyerOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setFoyerOptions(updatedOptions);
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

  const handleLightingToggle = (needed: boolean) => {
    handleUpdateOptions({
      lighting: {
        ...localOptions.lighting,
        needed
      }
    });
  };

  const handleClosetToggle = (needed: boolean) => {
    handleUpdateOptions({
      closet: {
        ...localOptions.closet,
        needed
      }
    });
  };

  const handleStairsToggle = (needed: boolean) => {
    handleUpdateOptions({
      stairs: {
        ...localOptions.stairs,
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
      title="Foyer Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Foyer Dimensions"
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
              roomType="foyer"
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
              type: type as 'tile' | 'hardwood' | 'engineered-hardwood' | 'marble'
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
              roomType="foyer"
              measurementType="flooring"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Lighting"
          isNeeded={localOptions.lighting.needed}
          onToggleNeeded={handleLightingToggle}
          selectedType={localOptions.lighting.type}
          onTypeChange={(type) => handleUpdateOptions({
            lighting: {
              ...localOptions.lighting,
              type: type as 'pendant' | 'chandelier' | 'recessed'
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
              max={4}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Closet"
          isNeeded={localOptions.closet.needed}
          onToggleNeeded={handleClosetToggle}
          selectedType={localOptions.closet.type}
          onTypeChange={(type) => handleUpdateOptions({
            closet: {
              ...localOptions.closet,
              type: type as 'basic' | 'custom'
            }
          })}
          options={closetOptions}
        >
          {localOptions.closet.needed && (
            <MaterialInput
              label="Square Feet of Closet"
              value={localOptions.closet.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                closet: {
                  ...localOptions.closet,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="foyer"
              measurementType="closet"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Stairs"
          isNeeded={localOptions.stairs.needed}
          onToggleNeeded={handleStairsToggle}
          selectedType={localOptions.stairs.type}
          onTypeChange={(type) => handleUpdateOptions({
            stairs: {
              ...localOptions.stairs,
              type: type as 'carpet' | 'hardwood' | 'refinish'
            }
          })}
          options={stairsOptions}
        >
          {localOptions.stairs.needed && (
            <MaterialInput
              label="Linear Feet of Stairs"
              value={localOptions.stairs.linearFeet}
              onChange={(linearFeet) => handleUpdateOptions({
                stairs: {
                  ...localOptions.stairs,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="foyer"
              measurementType="stairs"
            />
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default FoyerCustomizationModal;