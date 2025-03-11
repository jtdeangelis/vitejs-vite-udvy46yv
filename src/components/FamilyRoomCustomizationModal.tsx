import React, { useEffect, useState } from 'react';
import { FamilyRoomOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface FamilyRoomCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyRoomOptions: FamilyRoomOptions;
  setFamilyRoomOptions: React.Dispatch<React.SetStateAction<FamilyRoomOptions>>;
  onApply: () => void;
}

// Default family room options
const defaultFamilyRoomOptions: FamilyRoomOptions = {
  flooring: { needed: false, type: 'carpet', squareFeet: 240 },
  paint: { needed: false, type: 'standard', squareFeet: 550, finish: 'flat' },
  lighting: { needed: false, type: 'ceiling', count: 2 },
  windows: { needed: false, type: 'standard', count: 3 },
  fireplace: { needed: false, type: 'gas' },
  dimensions: { length: 20, width: 12 },
  trim: { needed: false, type: 'baseboards', linearFeet: 64 },
  fan: { needed: false, type: '52-inch', count: 1 },
  notes: '',
  customLineItems: []
};

const FamilyRoomCustomizationModal: React.FC<FamilyRoomCustomizationModalProps> = ({
  isOpen,
  onClose,
  familyRoomOptions: initialFamilyRoomOptions,
  setFamilyRoomOptions,
  onApply
}) => {
  // Initialize with default options if none provided
  const [localOptions, setLocalOptions] = useState<FamilyRoomOptions>({
    ...defaultFamilyRoomOptions,
    ...initialFamilyRoomOptions
  });

  // Update local state when props change
  useEffect(() => {
    setLocalOptions({
      ...defaultFamilyRoomOptions,
      ...initialFamilyRoomOptions
    });
  }, [initialFamilyRoomOptions]);

  const flooringOptions = [
    { value: 'carpet', label: 'Carpet', price: 5 },
    { value: 'hardwood', label: 'Hardwood', price: 12 },
    { value: 'engineered-hardwood', label: 'Engineered Hardwood', price: 10 },
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

  const lightingOptions = [
    { value: 'ceiling', label: 'Ceiling', price: 150 },
    { value: 'recessed', label: 'Recessed', price: 200 },
    { value: 'decorative', label: 'Decorative', price: 300 }
  ];

  const windowOptions = [
    { value: 'standard', label: 'Standard', price: 600 },
    { value: 'large', label: 'Large', price: 1200 },
    { value: 'sliding', label: 'Sliding', price: 1800 }
  ];

  const fireplaceOptions = [
    { value: 'gas', label: 'Gas', price: 3500 },
    { value: 'electric', label: 'Electric', price: 2000 },
    { value: 'wood', label: 'Wood', price: 5000 }
  ];

  const trimOptions = [
    { value: 'baseboards', label: 'Baseboards', price: 5 },
    { value: 'crown', label: 'Crown Molding', price: 7 },
    { value: 'both', label: 'Both', price: 12 }
  ];

  const fanOptions = [
    { value: '42-inch', label: '42" Fan', price: 150 },
    { value: '52-inch', label: '52" Fan', price: 200 },
    { value: '60-inch', label: '60" Fan', price: 300 }
  ];

  // Update measurements when dimensions change
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

    if (localOptions.trim?.needed) {
      updates = {
        ...updates,
        trim: {
          ...localOptions.trim,
          linearFeet: perimeter
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
      setFamilyRoomOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed,
    localOptions.trim?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<FamilyRoomOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setFamilyRoomOptions(updatedOptions);
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

  const handleWindowsToggle = (needed: boolean) => {
    handleUpdateOptions({
      windows: {
        ...localOptions.windows,
        needed
      }
    });
  };

  const handleFireplaceToggle = (needed: boolean) => {
    handleUpdateOptions({
      fireplace: {
        ...localOptions.fireplace,
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

  const handleFanToggle = (needed: boolean) => {
    handleUpdateOptions({
      fan: {
        ...localOptions.fan,
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
      title="Family Room Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Family Room Dimensions"
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
              roomType="family"
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
              type: type as 'carpet' | 'hardwood' | 'engineered-hardwood' | 'laminate'
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
              roomType="family"
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
              type: type as 'ceiling' | 'recessed' | 'decorative'
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
              max={8}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Windows"
          isNeeded={localOptions.windows.needed}
          onToggleNeeded={handleWindowsToggle}
          selectedType={localOptions.windows.type}
          onTypeChange={(type) => handleUpdateOptions({
            windows: {
              ...localOptions.windows,
              type: type as 'standard' | 'large' | 'sliding'
            }
          })}
          options={windowOptions}
        >
          {localOptions.windows.needed && (
            <CountInput
              label="Number of Windows"
              count={localOptions.windows.count}
              setCount={(count) => handleUpdateOptions({
                windows: {
                  ...localOptions.windows,
                  count
                }
              })}
              min={1}
              max={6}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Fireplace"
          isNeeded={localOptions.fireplace.needed}
          onToggleNeeded={handleFireplaceToggle}
          selectedType={localOptions.fireplace.type}
          onTypeChange={(type) => handleUpdateOptions({
            fireplace: {
              ...localOptions.fireplace,
              type: type as 'gas' | 'electric' | 'wood'
            }
          })}
          options={fireplaceOptions}
        />

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
              roomType="family"
              measurementType="trim"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Ceiling Fan"
          isNeeded={localOptions.fan.needed}
          onToggleNeeded={handleFanToggle}
          selectedType={localOptions.fan.type}
          onTypeChange={(type) => handleUpdateOptions({
            fan: {
              ...localOptions.fan,
              type: type as '42-inch' | '52-inch' | '60-inch'
            }
          })}
          options={fanOptions}
        >
          {localOptions.fan.needed && (
            <CountInput
              label="Number of Fans"
              count={localOptions.fan.count}
              setCount={(count) => handleUpdateOptions({
                fan: {
                  ...localOptions.fan,
                  count
                }
              })}
              min={1}
              max={4}
            />
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default FamilyRoomCustomizationModal;