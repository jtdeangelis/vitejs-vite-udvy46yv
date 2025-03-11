import React, { useEffect, useState } from 'react';
import { HallwayOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface HallwayCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  hallwayOptions: HallwayOptions;
  setHallwayOptions: React.Dispatch<React.SetStateAction<HallwayOptions>>;
  onApply: () => void;
}

const defaultHallwayOptions: HallwayOptions = {
  flooring: { needed: false, type: 'hardwood', squareFeet: 40 },
  paint: { needed: false, type: 'standard', squareFeet: 160, finish: 'flat' },
  lighting: { needed: false, type: 'ceiling', count: 2 },
  trim: {
    needed: false,
    types: {
      baseboards: { selected: false, linearFeet: 0 },
      crown: { selected: false, linearFeet: 0 }
    }
  },
  dimensions: { length: 10, width: 4 },
  notes: '',
  customLineItems: []
};

const HallwayCustomizationModal: React.FC<HallwayCustomizationModalProps> = ({
  isOpen,
  onClose,
  hallwayOptions: initialHallwayOptions,
  setHallwayOptions,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<HallwayOptions>({
    ...defaultHallwayOptions,
    ...initialHallwayOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultHallwayOptions,
      ...initialHallwayOptions
    });
  }, [initialHallwayOptions]);

  const flooringOptions = [
    { value: 'hardwood', label: 'Hardwood', price: 12 },
    { value: 'engineered-hardwood', label: 'Engineered Hardwood', price: 10 },
    { value: 'tile', label: 'Tile', price: 8 },
    { value: 'carpet', label: 'Carpet', price: 5 }
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
    { value: 'sconce', label: 'Wall Sconce', price: 175 }
  ];

  const trimOptions = [
    { value: 'baseboards', label: 'Baseboards', price: 5 },
    { value: 'crown', label: 'Crown Molding', price: 7 }
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

    if (localOptions.trim?.needed) {
      updates = {
        ...updates,
        trim: {
          ...localOptions.trim,
          types: {
            baseboards: {
              ...localOptions.trim.types.baseboards,
              linearFeet: localOptions.trim.types.baseboards.selected ? perimeter : 0
            },
            crown: {
              ...localOptions.trim.types.crown,
              linearFeet: localOptions.trim.types.crown.selected ? perimeter : 0
            }
          }
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
      setHallwayOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.flooring?.needed,
    localOptions.paint?.needed,
    localOptions.trim?.needed,
    localOptions.trim?.types.baseboards.selected,
    localOptions.trim?.types.crown.selected
  ]);

  const handleUpdateOptions = (updates: Partial<HallwayOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setHallwayOptions(updatedOptions);
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
      title="Hallway Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6">
        <DimensionInput
          label="Hallway Dimensions"
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
              roomType="hallway"
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
              type: type as 'hardwood' | 'engineered-hardwood' | 'tile' | 'carpet'
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
              roomType="hallway"
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
              type: type as 'ceiling' | 'recessed' | 'sconce'
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
              max={6}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Trim"
          isNeeded={localOptions.trim.needed}
          onToggleNeeded={handleTrimToggle}
          selectedType={null}
          options={trimOptions}
        >
          {localOptions.trim.needed && (
            <div className="space-y-4">
              {/* Baseboards */}
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={localOptions.trim.types.baseboards.selected}
                    onChange={(e) => handleUpdateOptions({
                      trim: {
                        ...localOptions.trim,
                        types: {
                          ...localOptions.trim.types,
                          baseboards: {
                            ...localOptions.trim.types.baseboards,
                            selected: e.target.checked
                          }
                        }
                      }
                    })}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Baseboards</span>
                </label>
                {localOptions.trim.types.baseboards.selected && (
                  <MaterialInput
                    label="Linear Feet of Baseboards"
                    value={localOptions.trim.types.baseboards.linearFeet}
                    onChange={(linearFeet) => handleUpdateOptions({
                      trim: {
                        ...localOptions.trim,
                        types: {
                          ...localOptions.trim.types,
                          baseboards: {
                            ...localOptions.trim.types.baseboards,
                            linearFeet
                          }
                        }
                      }
                    })}
                    unit="linear ft"
                    roomType="hallway"
                    measurementType="trim"
                  />
                )}
              </div>

              {/* Crown Molding */}
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={localOptions.trim.types.crown.selected}
                    onChange={(e) => handleUpdateOptions({
                      trim: {
                        ...localOptions.trim,
                        types: {
                          ...localOptions.trim.types,
                          crown: {
                            ...localOptions.trim.types.crown,
                            selected: e.target.checked
                          }
                        }
                      }
                    })}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Crown Molding</span>
                </label>
                {localOptions.trim.types.crown.selected && (
                  <MaterialInput
                    label="Linear Feet of Crown Molding"
                    value={localOptions.trim.types.crown.linearFeet}
                    onChange={(linearFeet) => handleUpdateOptions({
                      trim: {
                        ...localOptions.trim,
                        types: {
                          ...localOptions.trim.types,
                          crown: {
                            ...localOptions.trim.types.crown,
                            linearFeet
                          }
                        }
                      }
                    })}
                    unit="linear ft"
                    roomType="hallway"
                    measurementType="trim"
                  />
                )}
              </div>
            </div>
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default HallwayCustomizationModal;