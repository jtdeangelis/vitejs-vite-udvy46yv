import React, { useEffect, useState } from 'react';
import { CustomRoomOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface CustomRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, options: CustomRoomOptions) => void;
  existingOptions?: CustomRoomOptions;
  existingName?: string;
}

const defaultCustomRoomOptions: CustomRoomOptions = {
  name: '',
  flooring: { needed: false, type: 'hardwood', squareFeet: 144 },
  paint: { needed: false, type: 'standard', squareFeet: 400, finish: 'flat' },
  lighting: { needed: false, type: 'ceiling', count: 2 },
  windows: { needed: false, type: 'standard', count: 2 },
  trim: { needed: false, type: 'baseboards', linearFeet: 48 },
  dimensions: { length: 12, width: 12 },
  notes: '',
  customLineItems: []
};

const CustomRoomModal: React.FC<CustomRoomModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingOptions,
  existingName
}) => {
  const [name, setName] = useState(existingName || '');
  const [options, setOptions] = useState<CustomRoomOptions>({
    ...defaultCustomRoomOptions,
    ...existingOptions
  });

  useEffect(() => {
    if (isOpen) {
      setName(existingName || '');
      setOptions({
        ...defaultCustomRoomOptions,
        ...existingOptions
      });
    }
  }, [isOpen, existingName, existingOptions]);

  const flooringOptions = [
    { value: 'hardwood', label: 'Hardwood', price: 12 },
    { value: 'engineered-hardwood', label: 'Engineered Hardwood', price: 10 },
    { value: 'tile', label: 'Tile', price: 8 },
    { value: 'carpet', label: 'Carpet', price: 5 },
    { value: 'vinyl', label: 'Vinyl', price: 4 }
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
    { value: 'custom', label: 'Custom', price: 1800 }
  ];

  const trimOptions = [
    { value: 'baseboards', label: 'Baseboards', price: 5 },
    { value: 'crown', label: 'Crown Molding', price: 7 },
    { value: 'both', label: 'Both', price: 12 }
  ];

  useEffect(() => {
    if (!options.dimensions) return;
    
    const area = options.dimensions.length * options.dimensions.width;
    const perimeter = 2 * (options.dimensions.length + options.dimensions.width);
    const wallHeight = 8; // Standard 8' ceiling height
    const wallArea = perimeter * wallHeight;
    
    let updates = {};
    let hasUpdates = false;

    if (options.flooring?.needed) {
      updates = {
        ...updates,
        flooring: {
          ...options.flooring,
          squareFeet: area
        }
      };
      hasUpdates = true;
    }

    if (options.paint?.needed) {
      updates = {
        ...updates,
        paint: {
          ...options.paint,
          squareFeet: wallArea
        }
      };
      hasUpdates = true;
    }

    if (options.trim?.needed) {
      updates = {
        ...updates,
        trim: {
          ...options.trim,
          linearFeet: perimeter
        }
      };
      hasUpdates = true;
    }

    if (hasUpdates) {
      setOptions(prev => ({
        ...prev,
        ...updates
      }));
    }
  }, [
    options.dimensions,
    options.flooring?.needed,
    options.paint?.needed,
    options.trim?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<CustomRoomOptions>) => {
    setOptions(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleFlooringToggle = (needed: boolean) => {
    handleUpdateOptions({
      flooring: {
        ...options.flooring,
        needed
      }
    });
  };

  const handlePaintToggle = (needed: boolean) => {
    handleUpdateOptions({
      paint: {
        ...options.paint,
        needed
      }
    });
  };

  const handleLightingToggle = (needed: boolean) => {
    handleUpdateOptions({
      lighting: {
        ...options.lighting,
        needed
      }
    });
  };

  const handleWindowsToggle = (needed: boolean) => {
    handleUpdateOptions({
      windows: {
        ...options.windows,
        needed
      }
    });
  };

  const handleTrimToggle = (needed: boolean) => {
    handleUpdateOptions({
      trim: {
        ...options.trim,
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

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a room name');
      return;
    }
    onSave(name, options);
  };

  return (
    <ModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      title={existingName ? `Edit ${existingName}` : 'Add Custom Room'}
      onApply={handleSave}
      notes={options.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={options.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Room Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter room name"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div className="mb-6">
        <DimensionInput
          label="Room Dimensions"
          length={options.dimensions.length}
          width={options.dimensions.width}
          onLengthChange={(length) => handleUpdateOptions({
            dimensions: {
              ...options.dimensions,
              length
            }
          })}
          onWidthChange={(width) => handleUpdateOptions({
            dimensions: {
              ...options.dimensions,
              width
            }
          })}
        />
      </div>

      <div className="space-y-8">
        <OptionGroup
          title="Paint"
          isNeeded={options.paint?.needed || false}
          onToggleNeeded={handlePaintToggle}
          selectedType={options.paint?.type || 'standard'}
          onTypeChange={(type) => handleUpdateOptions({
            paint: {
              ...options.paint,
              type
            }
          })}
          options={paintOptions}
          isPaintGroup={true}
          paintFinish={options.paint?.finish || 'flat'}
          onPaintFinishChange={(finish) => handleUpdateOptions({
            paint: {
              ...options.paint,
              finish
            }
          })}
        >
          {options.paint?.needed && (
            <MaterialInput
              label="Wall Area to Paint"
              value={options.paint.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                paint: {
                  ...options.paint,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="custom"
              measurementType="paint"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Flooring"
          isNeeded={options.flooring.needed}
          onToggleNeeded={handleFlooringToggle}
          selectedType={options.flooring.type}
          onTypeChange={(type) => handleUpdateOptions({
            flooring: {
              ...options.flooring,
              type
            }
          })}
          options={flooringOptions}
          showInstallType={true}
          installType={options.flooring.installType}
          onInstallTypeChange={(installType) => handleUpdateOptions({
            flooring: {
              ...options.flooring,
              installType
            }
          })}
        >
          {options.flooring.needed && (
            <MaterialInput
              label="Square Feet of Flooring"
              value={options.flooring.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                flooring: {
                  ...options.flooring,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="custom"
              measurementType="flooring"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Lighting"
          isNeeded={options.lighting.needed}
          onToggleNeeded={handleLightingToggle}
          selectedType={options.lighting.type}
          onTypeChange={(type) => handleUpdateOptions({
            lighting: {
              ...options.lighting,
              type: type as 'ceiling' | 'recessed' | 'decorative'
            }
          })}
          options={lightingOptions}
        >
          {options.lighting.needed && (
            <CountInput
              label="Number of Light Fixtures"
              count={options.lighting.count}
              setCount={(count) => handleUpdateOptions({
                lighting: {
                  ...options.lighting,
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
          isNeeded={options.windows.needed}
          onToggleNeeded={handleWindowsToggle}
          selectedType={options.windows.type}
          onTypeChange={(type) => handleUpdateOptions({
            windows: {
              ...options.windows,
              type: type as 'standard' | 'large' | 'custom'
            }
          })}
          options={windowOptions}
        >
          {options.windows.needed && (
            <CountInput
              label="Number of Windows"
              count={options.windows.count}
              setCount={(count) => handleUpdateOptions({
                windows: {
                  ...options.windows,
                  count
                }
              })}
              min={1}
              max={6}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Trim"
          isNeeded={options.trim.needed}
          onToggleNeeded={handleTrimToggle}
          selectedType={options.trim.type}
          onTypeChange={(type) => handleUpdateOptions({
            trim: {
              ...options.trim,
              type: type as 'baseboards' | 'crown' | 'both'
            }
          })}
          options={trimOptions}
        >
          {options.trim.needed && (
            <MaterialInput
              label="Linear Feet of Trim"
              value={options.trim.linearFeet}
              onChange={(linearFeet) => handleUpdateOptions({
                trim: {
                  ...options.trim,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="custom"
              measurementType="trim"
            />
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default CustomRoomModal;