import React, { useEffect, useState } from 'react';
import { ExteriorOptions, CustomLineItem } from '../types';
import ModalTemplate from './base/ModalTemplate';
import OptionGroup from './OptionGroup';
import DimensionInput from './DimensionInput';
import MaterialInput from './MaterialInput';
import CountInput from './CountInput';

interface ExteriorCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  exteriorOptions: ExteriorOptions;
  setExteriorOptions: React.Dispatch<React.SetStateAction<ExteriorOptions>>;
  onApply: () => void;
}

// Default exterior options
const defaultExteriorOptions: ExteriorOptions = {
  siding: { needed: false, type: 'vinyl', squareFeet: 2000 },
  paint: { needed: false, type: 'standard', squareFeet: 2000, finish: 'flat' },
  roof: { needed: false, type: 'asphalt', squareFeet: 1500 },
  windows: { needed: false, type: 'vinyl', count: 12 },
  landscaping: { needed: false, type: 'basic', squareFeet: 5000 },
  driveway: { needed: false, type: 'asphalt', squareFeet: 800 },
  hvac: { needed: false, type: 'standard', tonnage: 3 },
  deck: {
    needed: false,
    type: 'pressureTreated',
    material: 'pressureTreated',
    style: 'basic',
    squareFeet: 200,
    features: {
      railing: { type: 'wood', linearFeet: 40 },
      stairs: { type: 'basic', count: 1 },
      lighting: { type: 'post', count: 4 }
    }
  },
  patio: {
    needed: false,
    type: 'concrete',
    material: 'concrete',
    style: 'basic',
    squareFeet: 200,
    features: {
      border: { type: 'simple', linearFeet: 40 },
      drainage: { type: 'basic', linearFeet: 40 }
    }
  },
  fence: {
    needed: false,
    type: 'wood',
    material: 'wood',
    style: 'basic',
    linearFeet: 200,
    features: {
      gates: { walk: 1, drive: 0, automatic: 0 },
      posts: { type: 'basic', count: 20 }
    }
  },
  dimensions: { perimeter: 160, lotSize: 10000 },
  notes: '',
  customLineItems: []
};

const ExteriorCustomizationModal: React.FC<ExteriorCustomizationModalProps> = ({
  isOpen,
  onClose,
  exteriorOptions: initialExteriorOptions,
  setExteriorOptions,
  onApply
}) => {
  const [localOptions, setLocalOptions] = useState<ExteriorOptions>({
    ...defaultExteriorOptions,
    ...initialExteriorOptions
  });

  useEffect(() => {
    setLocalOptions({
      ...defaultExteriorOptions,
      ...initialExteriorOptions
    });
  }, [initialExteriorOptions]);

  const sidingOptions = [
    { value: 'vinyl', label: 'Vinyl', price: 7 },
    { value: 'fiber-cement', label: 'Fiber Cement', price: 10 },
    { value: 'brick', label: 'Brick', price: 15 },
    { value: 'stucco', label: 'Stucco', price: 9 }
  ];

  const paintOptions = [
    { value: 'standard', label: 'Standard Paint', price: 0.75 },
    { value: 'premium', label: 'Premium Paint', price: 1.5 }
  ];

  const paintFinishOptions = [
    { value: 'flat', label: 'Flat', description: 'Best for exterior walls' },
    { value: 'eggshell', label: 'Eggshell', description: 'Good for siding and trim' },
    { value: 'satin', label: 'Satin', description: 'Ideal for high-exposure areas' },
    { value: 'semiGloss', label: 'Semi-Gloss', description: 'Best for trim and doors' }
  ];

  const roofOptions = [
    { value: 'asphalt', label: 'Asphalt', price: 4 },
    { value: 'metal', label: 'Metal', price: 10 },
    { value: 'tile', label: 'Tile', price: 15 }
  ];

  const windowOptions = [
    { value: 'vinyl', label: 'Vinyl', price: 500 },
    { value: 'wood', label: 'Wood', price: 800 },
    { value: 'fiberglass', label: 'Fiberglass', price: 1000 }
  ];

  const landscapingOptions = [
    { value: 'basic', label: 'Basic', price: 5 },
    { value: 'moderate', label: 'Moderate', price: 10 },
    { value: 'extensive', label: 'Extensive', price: 20 }
  ];

  const drivewayOptions = [
    { value: 'asphalt', label: 'Asphalt', price: 5 },
    { value: 'concrete', label: 'Concrete', price: 8 },
    { value: 'pavers', label: 'Pavers', price: 15 }
  ];

  const hvacOptions = [
    { value: 'standard', label: 'Standard', price: 3000 },
    { value: 'high-efficiency', label: 'High Efficiency', price: 5000 },
    { value: 'heat-pump', label: 'Heat Pump', price: 7000 }
  ];

  const deckOptions = [
    { value: 'pressureTreated', label: 'Pressure Treated', price: 35 },
    { value: 'cedar', label: 'Cedar', price: 45 },
    { value: 'composite', label: 'Composite', price: 65 },
    { value: 'tropical', label: 'Tropical Hardwood', price: 85 }
  ];

  const deckStyleOptions = [
    { value: 'basic', label: 'Basic', price: 0 },
    { value: 'premium', label: 'Premium', price: 10 },
    { value: 'custom', label: 'Custom', price: 25 }
  ];

  const patioOptions = [
    { value: 'concrete', label: 'Concrete', price: 8 },
    { value: 'pavers', label: 'Pavers', price: 15 },
    { value: 'stone', label: 'Natural Stone', price: 35 }
  ];

  const patioStyleOptions = [
    { value: 'basic', label: 'Basic', price: 0 },
    { value: 'premium', label: 'Premium', price: 10 },
    { value: 'custom', label: 'Custom', price: 20 }
  ];

  const fenceOptions = [
    { value: 'wood', label: 'Wood', price: 25 },
    { value: 'vinyl', label: 'Vinyl', price: 30 },
    { value: 'metal', label: 'Metal', price: 35 },
    { value: 'composite', label: 'Composite', price: 45 }
  ];

  const fenceStyleOptions = [
    { value: 'basic', label: 'Basic', price: 0 },
    { value: 'premium', label: 'Premium', price: 10 },
    { value: 'privacy', label: 'Privacy', price: 15 }
  ];

  useEffect(() => {
    if (!localOptions.dimensions) return;
    
    const sidingArea = localOptions.dimensions.perimeter * 10; // Assuming 10ft height
    const roofArea = localOptions.dimensions.lotSize * 0.2; // Assuming house footprint is 20% of lot
    
    let updates = {};
    let hasUpdates = false;

    if (localOptions.siding?.needed) {
      updates = {
        ...updates,
        siding: {
          ...localOptions.siding,
          squareFeet: sidingArea
        }
      };
      hasUpdates = true;
    }

    if (localOptions.paint?.needed) {
      updates = {
        ...updates,
        paint: {
          ...localOptions.paint,
          squareFeet: sidingArea
        }
      };
      hasUpdates = true;
    }

    if (localOptions.roof?.needed) {
      updates = {
        ...updates,
        roof: {
          ...localOptions.roof,
          squareFeet: roofArea
        }
      };
      hasUpdates = true;
    }

    if (localOptions.landscaping?.needed) {
      updates = {
        ...updates,
        landscaping: {
          ...localOptions.landscaping,
          squareFeet: localOptions.dimensions.lotSize * 0.7 // 70% of lot for landscaping
        }
      };
      hasUpdates = true;
    }

    if (localOptions.driveway?.needed) {
      updates = {
        ...updates,
        driveway: {
          ...localOptions.driveway,
          squareFeet: localOptions.dimensions.lotSize * 0.1 // 10% of lot for driveway
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
      setExteriorOptions(updatedOptions);
    }
  }, [
    localOptions.dimensions,
    localOptions.siding?.needed,
    localOptions.paint?.needed,
    localOptions.roof?.needed,
    localOptions.landscaping?.needed,
    localOptions.driveway?.needed
  ]);

  const handleUpdateOptions = (updates: Partial<ExteriorOptions>) => {
    const updatedOptions = {
      ...localOptions,
      ...updates
    };
    setLocalOptions(updatedOptions);
    setExteriorOptions(updatedOptions);
  };

  const handleSidingToggle = (needed: boolean) => {
    handleUpdateOptions({
      siding: {
        ...localOptions.siding,
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

  const handleRoofToggle = (needed: boolean) => {
    handleUpdateOptions({
      roof: {
        ...localOptions.roof,
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

  const handleLandscapingToggle = (needed: boolean) => {
    handleUpdateOptions({
      landscaping: {
        ...localOptions.landscaping,
        needed
      }
    });
  };

  const handleDrivewayToggle = (needed: boolean) => {
    handleUpdateOptions({
      driveway: {
        ...localOptions.driveway,
        needed
      }
    });
  };

  const handleHvacToggle = (needed: boolean) => {
    handleUpdateOptions({
      hvac: {
        ...localOptions.hvac || { tonnage: 3 },
        needed
      }
    });
  };

  const handleDeckToggle = (needed: boolean) => {
    handleUpdateOptions({
      deck: {
        ...localOptions.deck,
        needed
      }
    });
  };

  const handlePatioToggle = (needed: boolean) => {
    handleUpdateOptions({
      patio: {
        ...localOptions.patio,
        needed
      }
    });
  };

  const handleFenceToggle = (needed: boolean) => {
    handleUpdateOptions({
      fence: {
        ...localOptions.fence,
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
      title="Exterior Customization"
      onApply={onApply}
      notes={localOptions.notes || ''}
      onUpdateNotes={handleUpdateNotes}
      customLineItems={localOptions.customLineItems || []}
      onUpdateLineItems={handleUpdateLineItems}
    >
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            House Perimeter (ft)
          </label>
          <input
            type="number"
            min="50"
            value={localOptions.dimensions.perimeter}
            onChange={(e) => handleUpdateOptions({
              dimensions: {
                ...localOptions.dimensions,
                perimeter: Math.max(50, parseInt(e.target.value) || 0)
              }
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            The perimeter is the total distance around the house exterior. For a rectangular house, this is 2 × (length + width).
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lot Size (sq ft)
          </label>
          <input
            type="number"
            min="1000"
            value={localOptions.dimensions.lotSize}
            onChange={(e) => handleUpdateOptions({
              dimensions: {
                ...localOptions.dimensions,
                lotSize: Math.max(1000, parseInt(e.target.value) || 0)
              }
            })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-sm text-gray-500">
            The total area of your property, including the house footprint and all yard space.
          </p>
        </div>
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
              roomType="exterior"
              measurementType="paint"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Siding"
          isNeeded={localOptions.siding?.needed}
          onToggleNeeded={handleSidingToggle}
          selectedType={localOptions.siding?.type}
          onTypeChange={(type) => handleUpdateOptions({
            siding: {
              ...localOptions.siding,
              type: type as 'vinyl' | 'fiber-cement' | 'brick' | 'stucco'
            }
          })}
          options={sidingOptions}
        >
          {localOptions.siding?.needed && (
            <MaterialInput
              label="Square Feet of Siding"
              value={localOptions.siding.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                siding: {
                  ...localOptions.siding,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="exterior"
              measurementType="siding"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Roof"
          isNeeded={localOptions.roof?.needed}
          onToggleNeeded={handleRoofToggle}
          selectedType={localOptions.roof?.type}
          onTypeChange={(type) => handleUpdateOptions({
            roof: {
              ...localOptions.roof,
              type: type as 'asphalt' | 'metal' | 'tile'
            }
          })}
          options={roofOptions}
        >
          {localOptions.roof?.needed && (
            <MaterialInput
              label="Square Feet of Roof"
              value={localOptions.roof.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                roof: {
                  ...localOptions.roof,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="exterior"
              measurementType="roof"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Windows"
          isNeeded={localOptions.windows?.needed}
          onToggleNeeded={handleWindowsToggle}
          selectedType={localOptions.windows?.type}
          onTypeChange={(type) => handleUpdateOptions({
            windows: {
              ...localOptions.windows,
              type: type as 'vinyl' | 'wood' | 'fiberglass'
            }
          })}
          options={windowOptions}
        >
          {localOptions.windows?.needed && (
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
              max={50}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Landscaping"
          isNeeded={localOptions.landscaping?.needed}
          onToggleNeeded={handleLandscapingToggle}
          selectedType={localOptions.landscaping?.type}
          onTypeChange={(type) => handleUpdateOptions({
            landscaping: {
              ...localOptions.landscaping,
              type: type as 'basic' | 'moderate' | 'extensive'
            }
          })}
          options={landscapingOptions}
        >
          {localOptions.landscaping?.needed && (
            <MaterialInput
              label="Square Feet of Landscaping"
              value={localOptions.landscaping.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                landscaping: {
                  ...localOptions.landscaping,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="exterior"
              measurementType="landscaping"
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Driveway"
          isNeeded={localOptions.driveway?.needed}
          onToggleNeeded={handleDrivewayToggle}
          selectedType={localOptions.driveway?.type}
          onTypeChange={(type) => handleUpdateOptions({
            driveway: {
              ...localOptions.driveway,
              type: type as 'asphalt' | 'concrete' | 'pavers'
            }
          })}
          options={drivewayOptions}
        >
          {localOptions.driveway?.needed && (
            <MaterialInput
              label="Square Feet of Driveway"
              value={localOptions.driveway.squareFeet}
              onChange={(squareFeet) => handleUpdateOptions({
                driveway: {
                  ...localOptions.driveway,
                  squareFeet
                }
              })}
              unit="sq ft"
              roomType="exterior"
              measurementType="driveway"
            />
          )}
        </OptionGroup>
        
         <OptionGroup
          title="HVAC"
          isNeeded={localOptions.hvac?.needed}
          onToggleNeeded={handleHvacToggle}
          selectedType={localOptions.hvac?.type}
          onTypeChange={(type) => handleUpdateOptions({
            hvac: {
              ...localOptions.hvac,
              type: type as 'standard' | 'high-efficiency' | 'heat-pump'
            }
          })}
          options={hvacOptions}
        >
          {localOptions.hvac?.needed && (
            <CountInput
              label="HVAC Tonnage"
              count={localOptions.hvac.tonnage || 3}
              setCount={(tonnage) => handleUpdateOptions({
                hvac: {
                  ...localOptions.hvac,
                  tonnage
                }
              })}
              min={1}
              max={10}
            />
          )}
        </OptionGroup>

        <OptionGroup
          title="Deck"
          isNeeded={localOptions.deck?.needed}
          onToggleNeeded={handleDeckToggle}
          selectedType={localOptions.deck?.material}
          onTypeChange={(material) => handleUpdateOptions({
            deck: {
              ...localOptions.deck,
              material: material as 'pressureTreated' | 'cedar' | 'composite' | 'tropical',
              type: material
            }
          })}
          options={deckOptions}
        >
          {localOptions.deck?.needed && (
            <div className="space-y-4">
              <MaterialInput
                label="Square Feet of Deck"
                value={localOptions.deck.squareFeet}
                onChange={(squareFeet) => handleUpdateOptions({
                  deck: {
                    ...localOptions.deck,
                    squareFeet
                  }
                })}
                unit="sq ft"
                roomType="exterior"
                measurementType="deck"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deck Style
                </label>
                <select
                  value={localOptions.deck.style}
                  onChange={(e) => handleUpdateOptions({
                    deck: {
                      ...localOptions.deck,
                      style: e.target.value as 'basic' | 'premium' | 'custom'
                    }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {deckStyleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} (+${option.price}/sq ft)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900">Deck Features</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Railing Type
                  </label>
                  <select
                    value={localOptions.deck.features.railing?.type}
                    onChange={(e) => handleUpdateOptions({
                      deck: {
                        ...localOptions.deck,
                        features: {
                          ...localOptions.deck.features,
                          railing: {
                            ...localOptions.deck.features.railing,
                            type: e.target.value as 'wood' | 'metal' | 'glass' | 'composite'
                          }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="wood">Wood ($45/ft)</option>
                    <option value="metal">Metal ($85/ft)</option>
                    <option value="glass">Glass ($150/ft)</option>
                    <option value="composite">Composite ($95/ft)</option>
                  </select>

                  <MaterialInput
                    label="Linear Feet of Railing"
                    value={localOptions.deck.features.railing?.linearFeet || 0}
                    onChange={(linearFeet) => handleUpdateOptions({
                      deck: {
                        ...localOptions.deck,
                        features: {
                          ...localOptions.deck.features,
                          railing: {
                            ...localOptions.deck.features.railing,
                            linearFeet
                          }
                        }
                      }
                    })}
                    unit="linear ft"
                    roomType="exterior"
                    measurementType="railing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stairs Type
                  </label>
                  <select
                    value={localOptions.deck.features.stairs?.type}
                    onChange={(e) => handleUpdateOptions({
                      deck: {
                        ...localOptions.deck,
                        features: {
                          ...localOptions.deck.features,
                          stairs: {
                            ...localOptions.deck.features.stairs,
                            type: e.target.value as 'basic' | 'custom' | 'spiral'
                          }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="basic">Basic ($500/set)</option>
                    <option value="custom">Custom ($1,200/set)</option>
                    <option value="spiral">Spiral ($3,500/set)</option>
                  </select>

                  <CountInput
                    label="Number of Stair Sets"
                    count={localOptions.deck.features.stairs?.count || 1}
                    setCount={(count) => handleUpdateOptions({
                      deck: {
                        ...localOptions.deck,
                        features: {
                          ...localOptions.deck.features,
                          stairs: {
                            ...localOptions.deck.features.stairs,
                            count
                          }
                        }
                      }
                    })}
                    min={1}
                    max={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lighting Type
                  </label>
                  <select
                    value={localOptions.deck.features.lighting?.type}
                    onChange={(e) => handleUpdateOptions({
                      deck: {
                        ...localOptions.deck,
                        features: {
                          ...localOptions.deck.features,
                          lighting: {
                            ...localOptions.deck.features.lighting,
                            type: e.target.value as 'post' | 'riser' | 'accent'
                          }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="post">Post Lights ($75/each)</option>
                    <option value="riser">Stair Riser Lights ($45/each)</option>
                    <option value="accent">Accent Lights ($35/each)</option>
                  </select>

                  <CountInput
                    label="Number of Lights"
                    count={localOptions.deck.features.lighting?.count || 4}
                    setCount={(count) => handleUpdateOptions({
                      deck: {
                        ...localOptions.deck,
                        features: {
                          ...localOptions.deck.features,
                          lighting: {
                            ...localOptions.deck.features.lighting,
                            count
                          }
                        }
                      }
                    })}
                    min={1}
                    max={20}
                  />
                </div>
              </div>
            </div>
          )}
        </OptionGroup>

        <OptionGroup
          title="Patio"
          isNeeded={localOptions.patio?.needed}
          onToggleNeeded={handlePatioToggle}
          selectedType={localOptions.patio?.material}
          onTypeChange={(material) => handleUpdateOptions({
            patio: {
              ...localOptions.patio,
              material: material as 'concrete' | 'pavers' | 'stone',
              type: material
            }
          })}
          options={patioOptions}
        >
          {localOptions.patio?.needed && (
            <div className="space-y-4">
              <MaterialInput
                label="Square Feet of Patio"
                value={localOptions.patio.squareFeet}
                onChange={(squareFeet) => handleUpdateOptions({
                  patio: {
                    ...localOptions.patio,
                    squareFeet
                  }
                })}
                unit="sq ft"
                roomType="exterior"
                measurementType="patio"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patio Style
                </label>
                <select
                  value={localOptions.patio.style}
                  onChange={(e) => handleUpdateOptions({
                    patio: {
                      ...localOptions.patio,
                      style: e.target.value as 'basic' | 'premium' | 'custom'
                    }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {patioStyleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} (+${option.price}/sq ft)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900">Patio Features</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Type
                  </label>
                  <select
                    value={localOptions.patio.features.border?.type}
                    onChange={(e) => handleUpdateOptions({
                      patio: {
                        ...localOptions.patio,
                        features: {
                          ...localOptions.patio.features,
                          border: {
                            ...localOptions.patio.features.border,
                            type: e.target.value as 'simple' | 'decorative' | 'custom'
                          }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="simple">Simple ($25/ft)</option>
                    <option value="decorative">Decorative ($45/ft)</option>
                    <option value="custom">Custom ($65/ft)</option>
                  </select>

                  <MaterialInput
                    label="Linear Feet of Border"
                    value={localOptions.patio.features.border?.linearFeet || 0}
                    onChange={(linearFeet) => handleUpdateOptions({
                      patio: {
                        ...localOptions.patio,
                        features: {
                          ...localOptions.patio.features,
                          border: {
                            ...localOptions.patio.features.border,
                            linearFeet
                          }
                        }
                      }
                    })}
                    unit="linear ft"
                    roomType="exterior"
                    measurementType="border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drainage Type
                  </label>
                  <select
                    value={localOptions.patio.features.drainage?.type}
                    onChange={(e) => handleUpdateOptions({
                      patio: {
                        ...localOptions.patio,
                        features: {
                          ...localOptions.patio.features,
                          drainage: {
                            ...localOptions.patio.features.drainage,
                            type: e.target.value as 'basic' | 'french' | 'complete'
                          }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="basic">Basic ($8/ft)</option>
                    <option value="french">French Drain ($15/ft)</option>
                    <option value="complete">Complete System ($25/ft)</option>
                  </select>

                  <MaterialInput
                    label="Linear Feet of Drainage"
                    value={localOptions.patio.features.drainage?.linearFeet || 0}
                    onChange={(linearFeet) => handleUpdateOptions({
                      patio: {
                        ...localOptions.patio,
                        features: {
                          ...localOptions.patio.features,
                          drainage: {
                            ...localOptions.patio.features.drainage,
                            linearFeet
                          }
                        }
                      }
                    })}
                    unit="linear ft"
                    roomType="exterior"
                    measurementType="drainage"
                  />
                </div>
              </div>
            </div>
          )}
        </OptionGroup>

        <OptionGroup
          title="Fence"
          isNeeded={localOptions.fence?.needed}
          onToggleNeeded={handleFenceToggle}
          selectedType={localOptions.fence?.material}
          onTypeChange={(material) => handleUpdateOptions({
            fence: {
              ...localOptions.fence,
              material: material as 'wood' | 'vinyl' | 'metal' | 'composite',
              type: material
            }
          })}
          options={fenceOptions}
        >
          {localOptions.fence?.needed && (
            <div className="space-y-4">
              <MaterialInput
                label="Linear Feet of Fence"
                value={localOptions.fence.linearFeet}
                onChange={(linearFeet) => handleUpdateOptions({ fence: {
                  ...localOptions.fence,
                  linearFeet
                }
              })}
              unit="linear ft"
              roomType="exterior"
              measurementType="fence"
            />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fence Style
                </label>
                <select
                  value={localOptions.fence.style}
                  onChange={(e) => handleUpdateOptions({
                    fence: {
                      ...localOptions.fence,
                      style: e.target.value as 'basic' | 'premium' | 'privacy'
                    }
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {fenceStyleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label} (+${option.price}/ft)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900">Fence Features</h4>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Gates</h5>
                  <div className="space-y-3">
                    <CountInput
                      label="Walk Gates"
                      count={localOptions.fence.features.gates?.walk || 0}
                      setCount={(count) => handleUpdateOptions({
                        fence: {
                          ...localOptions.fence,
                          features: {
                            ...localOptions.fence.features,
                            gates: {
                              ...localOptions.fence.features.gates,
                              walk: count
                            }
                          }
                        }
                      })}
                      min={0}
                      max={10}
                    />
                    <CountInput
                      label="Drive Gates"
                      count={localOptions.fence.features.gates?.drive || 0}
                      setCount={(count) => handleUpdateOptions({
                        fence: {
                          ...localOptions.fence,
                          features: {
                            ...localOptions.fence.features,
                            gates: {
                              ...localOptions.fence.features.gates,
                              drive: count
                            }
                          }
                        }
                      })}
                      min={0}
                      max={4}
                    />
                    <CountInput
                      label="Automatic Gates"
                      count={localOptions.fence.features.gates?.automatic || 0}
                      setCount={(count) => handleUpdateOptions({
                        fence: {
                          ...localOptions.fence,
                          features: {
                            ...localOptions.fence.features,
                            gates: {
                              ...localOptions.fence.features.gates,
                              automatic: count
                            }
                          }
                        }
                      })}
                      min={0}
                      max={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Type
                  </label>
                  <select
                    value={localOptions.fence.features.posts?.type}
                    onChange={(e) => handleUpdateOptions({
                      fence: {
                        ...localOptions.fence,
                        features: {
                          ...localOptions.fence.features,
                          posts: {
                            ...localOptions.fence.features.posts,
                            type: e.target.value as 'basic' | 'premium' | 'solar'
                          }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="basic">Basic ($45/post)</option>
                    <option value="premium">Premium ($75/post)</option>
                    <option value="solar">Solar ($150/post)</option>
                  </select>

                  <CountInput
                    label="Number of Posts"
                    count={localOptions.fence.features.posts?.count || 0}
                    setCount={(count) => handleUpdateOptions({
                      fence: {
                        ...localOptions.fence,
                        features: {
                          ...localOptions.fence.features,
                          posts: {
                            ...localOptions.fence.features.posts,
                            count
                          }
                        }
                      }
                    })}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>
          )}
        </OptionGroup>
      </div>
    </ModalTemplate>
  );
};

export default ExteriorCustomizationModal;