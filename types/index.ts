// Room Types
export interface Room {
  id: number;
  name: string;
  type?: string;
  customized: boolean;
  cost: number;
  isCustomRoom?: boolean;
  options?: RoomOptions;
  dimensions?: {
    length: number;
    width: number;
  };
}

export interface IndividualRoom extends Room {
  type: 'bedroom' | 'bathroom';
}

// Material Options
export interface MaterialOption {
  needed: boolean;
  type: string;
  squareFeet?: number;
  linearFeet?: number;
  count?: number;
  installType?: 'install' | 'refinish';
  finish?: string;
  style?: string;
  brand?: string;
  grade?: 'basic' | 'premium' | 'luxury';
  features?: string[];
}

// Custom Line Items
export interface CustomLineItem {
  id: number;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  description?: string;
  category?: string;
  supplier?: string;
  notes?: string;
}

// Paint Options
export interface PaintOption {
  needed: boolean;
  type: string;
  squareFeet: number;
  finish: 'flat' | 'eggshell' | 'satin' | 'semiGloss';
}

// Room Options
export interface RoomOptions {
  dimensions: {
    length: number;
    width: number;
  };
  paint?: PaintOption;
  notes?: string;
  customLineItems?: CustomLineItem[];
  [key: string]: any;
}

// Kitchen Options
export interface KitchenOptions extends RoomOptions {
  cabinets?: MaterialOption;
  countertops?: MaterialOption;
  flooring?: MaterialOption;
  paint: PaintOption;
  appliances?: MaterialOption;
  backsplash?: MaterialOption;
  trim?: MaterialOption;
}

// Living Room Options
export interface LivingRoomOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  lighting?: MaterialOption;
  windows?: MaterialOption;
  trim?: MaterialOption;
  builtIns?: MaterialOption;
  fan?: MaterialOption;
}

// Family Room Options
export interface FamilyRoomOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  lighting?: MaterialOption;
  windows?: MaterialOption;
  fireplace?: MaterialOption;
  trim?: MaterialOption;
  fan?: MaterialOption;
}

// Dining Room Options
export interface DiningRoomOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  lighting?: MaterialOption;
  windows?: MaterialOption;
  trim?: MaterialOption;
  builtIns?: MaterialOption;
  fan?: MaterialOption;
}

// Foyer Options
export interface FoyerOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  lighting?: MaterialOption;
  closet?: MaterialOption;
  stairs?: MaterialOption;
}

// Laundry Room Options
export interface LaundryRoomOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  cabinets?: MaterialOption;
  countertops?: MaterialOption;
  sink?: MaterialOption;
  appliances?: MaterialOption;
}

// Garage Options
export interface GarageOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  doors?: MaterialOption;
  storage?: MaterialOption;
  electrical?: MaterialOption;
  lighting?: MaterialOption;
}

// Exterior Options
export interface ExteriorOptions extends RoomOptions {
  siding?: MaterialOption;
  roof?: MaterialOption;
  windows?: MaterialOption;
  landscaping?: MaterialOption;
  driveway?: MaterialOption;
  hvac?: MaterialOption;
  deck?: MaterialOption & {
    material: 'pressureTreated' | 'cedar' | 'composite' | 'tropical';
    style: 'basic' | 'premium' | 'custom';
    features: {
      railing?: {
        type: 'wood' | 'metal' | 'glass' | 'composite';
        linearFeet: number;
      };
      stairs?: {
        type: 'basic' | 'custom' | 'spiral';
        count: number;
      };
      lighting?: {
        type: 'post' | 'riser' | 'accent';
        count: number;
      };
    };
  };
  patio?: MaterialOption & {
    material: 'concrete' | 'pavers' | 'stone';
    style: 'basic' | 'premium' | 'custom';
    features: {
      border?: {
        type: 'simple' | 'decorative' | 'custom';
        linearFeet: number;
      };
      drainage?: {
        type: 'basic' | 'french' | 'complete';
        linearFeet: number;
      };
    };
  };
  fence?: MaterialOption & {
    material: 'wood' | 'vinyl' | 'metal' | 'composite';
    style: 'basic' | 'premium' | 'privacy';
    features: {
      gates?: {
        walk: number;
        drive: number;
        automatic: number;
      };
      posts?: {
        type: 'basic' | 'premium' | 'solar';
        count: number;
      };
    };
  };
  dimensions: {
    perimeter: number;
    lotSize: number;
  };
}

// Hallway Options
export interface HallwayOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  lighting?: MaterialOption;
  trim?: {
    needed: boolean;
    types: {
      baseboards: { selected: boolean; linearFeet: number };
      crown: { selected: boolean; linearFeet: number };
    };
  };
}

// Bedroom Options
export interface BedroomOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  closet?: MaterialOption;
  lighting?: MaterialOption;
  windows?: MaterialOption;
  trim?: MaterialOption;
  fan?: MaterialOption;
}

// Bathroom Options
export interface BathroomOptions extends RoomOptions {
  flooring?: MaterialOption;
  paint: PaintOption;
  vanity?: MaterialOption;
  shower?: MaterialOption;
  toilet?: MaterialOption;
  lighting?: MaterialOption;
  tile?: MaterialOption;
  faucet?: {
    needed: boolean;
    type: string;
    finish?: 'chrome' | 'brushed-nickel' | 'oil-rubbed-bronze' | 'matte-black';
  };
}

// Door Option
export interface DoorOption {
  needed: boolean;
  type: string;
  width: 24 | 28 | 30 | 32 | 36;
  handedness: 'left' | 'right';
  location: 'interior' | 'exterior';
}

// Property Details
export interface PropertyDetails {
  id?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  squareFeet?: number;
  yearBuilt?: number;
  purchasePrice?: number;
  estimatedARV?: number;
  photosAlbumUrl?: string;
}

// Action Types
export type Action =
  | { type: 'UPDATE_PROPERTY_DETAILS'; payload: PropertyDetails }
  | { type: 'UPDATE_FIXED_ROOMS'; payload: Room[] }
  | { type: 'UPDATE_BEDROOMS'; payload: IndividualRoom[] }
  | { type: 'UPDATE_BATHROOMS'; payload: IndividualRoom[] }
  | { type: 'ADD_BEDROOM'; payload: { name: string } }
  | { type: 'DELETE_BEDROOM'; payload: { id: number } }
  | { type: 'ADD_BATHROOM'; payload: { name: string } }
  | { type: 'DELETE_BATHROOM'; payload: { id: number } }
  | { type: 'ADD_CUSTOM_ROOM'; payload: { name: string; options: any } }
  | { type: 'EDIT_CUSTOM_ROOM'; payload: { id: number; name: string; options: any } }
  | { type: 'DELETE_CUSTOM_ROOM'; payload: { id: number } }
  | { type: 'UPDATE_ROOM_CUSTOMIZATION'; payload: { roomType: string; roomId: number; isCustomized: boolean } }
  | { type: 'UPDATE_KITCHEN_OPTIONS'; payload: KitchenOptions }
  | { type: 'UPDATE_LIVING_ROOM_OPTIONS'; payload: LivingRoomOptions }
  | { type: 'UPDATE_FAMILY_ROOM_OPTIONS'; payload: FamilyRoomOptions }
  | { type: 'UPDATE_DINING_ROOM_OPTIONS'; payload: DiningRoomOptions }
  | { type: 'UPDATE_FOYER_OPTIONS'; payload: FoyerOptions }
  | { type: 'UPDATE_LAUNDRY_ROOM_OPTIONS'; payload: LaundryRoomOptions }
  | { type: 'UPDATE_GARAGE_OPTIONS'; payload: GarageOptions }
  | { type: 'UPDATE_EXTERIOR_OPTIONS'; payload: ExteriorOptions }
  | { type: 'UPDATE_HALLWAY_OPTIONS'; payload: HallwayOptions }
  | { type: 'UPDATE_BEDROOM_OPTIONS'; payload: { id: number; options: BedroomOptions } }
  | { type: 'UPDATE_BATHROOM_OPTIONS'; payload: { id: number; options: BathroomOptions } }
  | { type: 'UPDATE_SELECTED_ROOM'; payload: { id: number; name: string } | null }
  | { type: 'LOAD_PROJECT'; payload: any };

// Project State
export interface ProjectState {
  propertyDetails: PropertyDetails;
  fixedRooms: Room[];
  bedrooms: IndividualRoom[];
  bathrooms: IndividualRoom[];
  customRooms: Room[];
  doors: DoorOption[];
  kitchenOptions: KitchenOptions;
  livingRoomOptions: LivingRoomOptions;
  familyRoomOptions: FamilyRoomOptions;
  diningRoomOptions: DiningRoomOptions;
  foyerOptions: FoyerOptions;
  laundryRoomOptions: LaundryRoomOptions;
  garageOptions: GarageOptions;
  exteriorOptions: ExteriorOptions;
  hallwayOptions: HallwayOptions;
  bedroomOptionsMap: Record<number, BedroomOptions>;
  bathroomOptionsMap: Record<number, BathroomOptions>;
  selectedRoom: { id: number; name: string } | null;
}