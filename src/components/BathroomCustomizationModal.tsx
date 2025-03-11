import React, { useEffect, useState } from 'react';
import { BathroomOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface BathroomCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bathroomOptions: BathroomOptions;
  setBathroomOptions: React.Dispatch<React.SetStateAction<BathroomOptions>>;
  roomName: string;
  onApply: () => void;
}

const defaultBathroomOptions: BathroomOptions = {
  flooring: { needed: false, type: 'vinyl', squareFeet: 48 },
  paint: { needed: false, type: 'standard', squareFeet: 160, finish: 'satin' },
  vanity: { needed: false, type: 'basic', linearFeet: 3 },
  shower: { needed: false, type: 'standard', squareFeet: 9 },
  toilet: { needed: false, type: 'standard' },
  lighting: { needed: false, type: 'basic', count: 2 },
  dimensions: { length: 8, width: 6 },
  tile: { needed: false, type: 'ceramic', squareFeet: 60 },
  faucet: { needed: false, type: 'single-handle', finish: 'chrome' },
  notes: '',
  customLineItems: []
};

const BathroomCustomizationModal: React.FC<BathroomCustomizationModalProps> = ({
  isOpen,
  onClose,
  bathroomOptions: initialBathroomOptions,
  setBathroomOptions,
  roomName,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<BathroomOptions>({
    ...defaultBathroomOptions,
    ...initialBathroomOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultBathroomOptions,
      ...initialBathroomOptions
    });
  }, [initialBathroomOptions]);

  const flooringOptions = [
    { value: 'vinyl', label: 'Vinyl', price: 4 },
    { value: 'tile', label: 'Tile', price: 8 },
    { value: 'luxury-vinyl', label: 'Luxury Vinyl', price: 6 },
    { value: 'stone', label: 'Natural Stone', price: 15 }
  ];

  const paintOptions = [
    { value: 'standard', label: 'Standard Paint', price: 0.75 },
    { value: 'premium', label: 'Premium Paint', price: 1.5 }
  ];

  const paintFinishOptions = [
    { value: 'flat', label: 'Flat', description: 'Best for ceilings' },
    { value: 'eggshell', label: 'Eggshell', description: 'Good for low-moisture walls' },
    { value: 'satin', label: 'Satin', description: 'Ideal for bathrooms' },
    { value: 'semiGloss', label: 'Semi-Gloss', description: 'Best for high-moisture areas' }
  ];

  const vanityOptions = [
    { value: 'basic', label: 'Basic', price: 150 },
    { value: 'custom', label: 'Custom', price: 350 },
    { value: 'floating', label: 'Floating', price: 400 }
  ];

  const showerOptions = [
    { value: 'standard', label: 'Standard', price: 1500 },
    { value: 'walk-in', label: 'Walk-in', price: 3000 },
    { value: 'tub-combo', label: 'Tub/Shower Combo', price: 2500 }
  ];

  const toiletOptions = [
    { value: 'standard', label: 'Standard', price: 300 },
    { value: 'comfort-height', label: 'Comfort Height', price: 500 },
    { value: 'dual-flush', label: 'Dual Flush', price: 600 }
  ];

  const lightingOptions = [
    { value: 'basic', label: 'Basic', price: 100 },
    { value: 'vanity', label: 'Vanity', price: 200 },
    { value: 'recessed', label: 'Recessed', price: 200 }
  ];

  const tileOptions = [
    { value: 'ceramic', label: 'Ceramic', price: 10 },
    { value: 'porcelain', label: 'Porcelain', price: 15 },
    { value: 'natural-stone', label: 'Natural Stone', price: 25 }
  ];

  const faucetOptions = [
    { value: 'single-handle', label: 'Single Handle', price: 150 },
    { value: 'widespread', label: 'Widespread', price: 250 },
    { value: 'waterfall', label: 'Waterfall', price: 300 }
  ];

  const finishOptions = [
    { value: 'chrome', label: 'Chrome' },
    { value: 'brushed-nickel', label: 'Brushed Nickel' },
    { value: 'oil-rubbed-bronze', label: 'Oil Rubbed Bronze' },
    { value: 'matte-black', label: 'Matte Black' }
  ];

  useEffect(() => {
    if (!localOptions.dimensions) return;
    
    const area = localOptions.dimensions.length * localOptions.dimensions.width;
    const perimeter = 2 * (localOptions.dimensions.length + localOptions.dimensions.width);
    const wallHeight = 8; // Standard 8' ceiling height
    const wallArea = perimeter * wallHeight;
    const showerWallArea = localOptions.shower?.needed ? 
      (localOptions.shower.squareFeet * 2.5) : 0; // Approximate shower wall area
    
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
          squareFeet: wallArea - showerWallArea // Subtract shower area from paint area
        }
      };
      hasUpdates = true;
    }

    if (localOptions.tile?.needed) {
      updates = {
        ...updates,
        tile: {
          ...localOptions.tile,
          squareFeet: showerWallArea + (area * 0.2) // Shower walls plus 20% of floor for backsplash
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
      setBathroomOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed,
    localOptions.tile?.needed,
    localOptions.shower?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<BathroomOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setBathroomOptions(updatedOptions);
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

  const handleVanityToggle = (needed: boolean) => {
    handleUpdateOptions({
      vanity: {
        ...localOptions.vanity,
        needed
      }
    });
  };

  const handleShowerToggle = (needed: boolean) => {
    handleUpdateOptions({
      shower: {
        ...localOptions.shower,
        needed
      }
    });
  };

  const handleToiletToggle = (needed: boolean) => {
    handleUpdateOptions({
      toilet: {
        ...localOptions.toilet,
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

  const handleTileToggle = (needed: boolean) => {
    handleUpdateOptions({
      tile: {
        ...localOptions.tile,
        needed
      }
    });
  };

  const handleFaucetToggle = (needed: boolean) => {
    handleUpdateOptions({
      faucet: {
        ...localOptions.faucet,
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
      title={`${roomName} Customization`}
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Bathroom Dimensions"
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
          paintFinish={localOptions.paint?.finish || 'satin'}
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
              roomType="bathroom"
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
              type: type as 'vinyl' | 'tile' | 'luxury-vinyl' | 'stone'
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
              roomType="bathroom"
              measurementType="flooring"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Vanity"
          isNeeded={localOptions.vanity.needed}
          onToggleNeeded={handleVanityToggle}
          selectedType={localOptions.vanity.type}
          onTypeChange={(type) => handleUpdateOptions({
            vanity: {
              ...localOptions.vanity,
              type: type as 'basic' | 'custom' | 'floating'
            }
          })}
          options={vanityOptions}
        >
          {localOptions.vanity.needed && (
            <MaterialInput
              label="Linear Feet of Vanity"
              value={localOptions.vanity.linearFeet}
              onChange={(linearFeet) => handleUpdateOptions({
                vanity: {
                  ...localOptions.vanity,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="bathroom"
              measurementType="vanity"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Shower"
          isNeeded={localOptions.shower.needed}
          onToggleNeeded={handleShowerToggle}
          selectedType={localOptions.shower.type}
          onTypeChange={(type) => handleUpdateOptions({
            shower: {
              ...localOptions.shower,
              type: type as 'standard' | 'walk-in' | 'tub-combo'
            }
          })}
          options={showerOptions}
        >
          {localOptions.shower.needed && (
            <MaterialInput
              label="Square Feet of Shower"
              value={localOptions.shower.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                shower: {
                  ...localOptions.shower,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="bathroom"
              measurementType="shower"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Toilet"
          isNeeded={localOptions.toilet.needed}
          onToggleNeeded={handleToiletToggle}
          selectedType={localOptions.toilet.type}
          onTypeChange={(type) => handleUpdateOptions({
            toilet: {
              ...localOptions.toilet,
              type: type as 'standard' | 'comfort-height' | 'dual-flush'
            }
          })}
          options={toiletOptions}
        />

        <OptionGroup
          title="Lighting"
          isNeeded={localOptions.lighting.needed}
          onToggleNeeded={handleLightingToggle}
          selectedType={localOptions.lighting.type}
          onTypeChange={(type) => handleUpdateOptions({
            lighting: {
              ...localOptions.lighting,
              type: type as 'basic' | 'vanity' | 'recessed'
            }
          })}
          options={lightingOptions} >
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
              max={6}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Tile"
          isNeeded={localOptions.tile.needed}
          onToggleNeeded={handleTileToggle}
          selectedType={localOptions.tile.type}
          onTypeChange={(type) => handleUpdateOptions({
            tile: {
              ...localOptions.tile,
              type: type as 'ceramic' | 'porcelain' | 'natural-stone'
            }
          })}
          options={tileOptions}
        >
          {localOptions.tile.needed && (
            <MaterialInput
              label="Square Feet of Tile"
              value={localOptions.tile.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                tile: {
                  ...localOptions.tile,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="bathroom"
              measurementType="tile"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Faucet"
          isNeeded={localOptions.faucet.needed}
          onToggleNeeded={handleFaucetToggle}
          selectedType={localOptions.faucet.type}
          onTypeChange={(type) => handleUpdateOptions({
            faucet: {
              ...localOptions.faucet,
              type: type as 'single-handle' | 'widespread' | 'waterfall'
            }
          })}
          options={faucetOptions}
        >
          {localOptions.faucet.needed && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finish
              </label>
              <select
                value={localOptions.faucet.finish}
                onChange={(e) => handleUpdateOptions({
                  faucet: {
                    ...localOptions.faucet,
                    finish: e.target.value as 'chrome' | 'brushed-nickel' | 'oil-rubbed-bronze' | 'matte-black'
                  }
                })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                {finishOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default BathroomCustomizationModal;