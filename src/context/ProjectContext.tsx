import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  Room, 
  IndividualRoom, 
  PropertyDetails, 
  KitchenOptions, 
  BedroomOptions, 
  BathroomOptions, 
  LivingRoomOptions,
  FamilyRoomOptions,
  DiningRoomOptions,
  FoyerOptions,
  LaundryRoomOptions,
  GarageOptions,
  ExteriorOptions,
  HallwayOptions,
  CustomRoomOptions,
  Action,
  ProjectState
} from '../types';

// Initialize the default state
const initialState: ProjectState = {
  propertyDetails: {
    address: '',
    city: '',
    state: '',
    zipCode: '',
    squareFeet: 0,
    yearBuilt: 0,
    purchasePrice: 0,
    estimatedARV: 0
  },
  fixedRooms: [
    { id: 1, name: 'Kitchen', customized: false, cost: 0 },
    { id: 2, name: 'Living Room', customized: false, cost: 0 },
    { id: 3, name: 'Family Room', customized: false, cost: 0 },
    { id: 4, name: 'Dining Room', customized: false, cost: 0 },
    { id: 5, name: 'Foyer', customized: false, cost: 0 },
    { id: 6, name: 'Laundry Room', customized: false, cost: 0 },
    { id: 7, name: 'Garage', customized: false, cost: 0 },
    { id: 8, name: 'Exterior', customized: false, cost: 0 },
    { id: 9, name: 'Hallway', customized: false, cost: 0 }
  ],
  bedrooms: [
    { id: 1, name: 'Master Bedroom', type: 'bedroom', customized: false, cost: 0 },
    { id: 2, name: 'Bedroom 2', type: 'bedroom', customized: false, cost: 0 }
  ],
  bathrooms: [
    { id: 1, name: 'Master Bathroom', type: 'bathroom', customized: false, cost: 0 },
    { id: 2, name: 'Bathroom 2', type: 'bathroom', customized: false, cost: 0 }
  ],
  customRooms: [],
  doors: [],
  kitchenOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 400 },
    cabinets: { needed: false, type: 'stock', linearFeet: 30 },
    countertops: { needed: false, type: 'laminate', squareFeet: 60 },
    flooring: { needed: false, type: 'vinyl', squareFeet: 150 },
    appliances: { needed: false, type: 'basic' },
    backsplash: { needed: false, type: 'ceramic', squareFeet: 30 },
    trim: { needed: false, type: 'baseboards', linearFeet: 60 },
    dimensions: { length: 15, width: 10 },
    notes: '',
    customLineItems: []
  },
  livingRoomOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 500 },
    flooring: { needed: false, type: 'carpet', squareFeet: 200 },
    lighting: { needed: false, type: 'ceiling', count: 2 },
    windows: { needed: false, type: 'standard', count: 3 },
    trim: { needed: false, type: 'baseboards', linearFeet: 60 },
    builtIns: { needed: false, type: 'bookcase', linearFeet: 6 },
    fan: { needed: false, type: '52-inch', count: 1 },
    dimensions: { length: 16, width: 14 },
    notes: '',
    customLineItems: []
  },
  familyRoomOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 550 },
    flooring: { needed: false, type: 'carpet', squareFeet: 240 },
    lighting: { needed: false, type: 'ceiling', count: 2 },
    windows: { needed: false, type: 'standard', count: 3 },
    fireplace: { needed: false, type: 'gas' },
    dimensions: { length: 20, width: 12 },
    trim: { needed: false, type: 'baseboards', linearFeet: 64 },
    fan: { needed: false, type: '52-inch', count: 1 },
    notes: '',
    customLineItems: []
  },
  diningRoomOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 400 },
    flooring: { needed: false, type: 'hardwood', squareFeet: 144 },
    lighting: { needed: false, type: 'chandelier', count: 1 },
    windows: { needed: false, type: 'standard', count: 2 },
    trim: { needed: false, type: 'baseboards', linearFeet: 48 },
    builtIns: { needed: false, type: 'china-cabinet', linearFeet: 6 },
    fan: { needed: false, type: '52-inch', count: 1 },
    dimensions: { length: 12, width: 12 },
    notes: '',
    customLineItems: []
  },
  foyerOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 300 },
    flooring: { needed: false, type: 'tile', squareFeet: 64 },
    lighting: { needed: false, type: 'pendant', count: 1 },
    closet: { needed: false, type: 'basic', squareFeet: 8 },
    stairs: { needed: false, type: 'carpet', linearFeet: 12 },
    dimensions: { length: 8, width: 8 },
    notes: '',
    customLineItems: []
  },
  laundryRoomOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 200 },
    flooring: { needed: false, type: 'vinyl', squareFeet: 48 },
    cabinets: { needed: false, type: 'basic', linearFeet: 6 },
    countertops: { needed: false, type: 'laminate', squareFeet: 12 },
    sink: { needed: false, type: 'utility' },
    appliances: { needed: false, type: 'basic' },
    dimensions: { length: 8, width: 6 },
    notes: '',
    customLineItems: []
  },
  garageOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 800 },
    flooring: { needed: false, type: 'concrete', squareFeet: 400 },
    doors: { needed: false, type: 'basic', count: 2 },
    storage: { needed: false, type: 'shelving', linearFeet: 12 },
    electrical: { needed: false, type: 'basic' },
    lighting: { needed: false, type: 'basic', count: 4 },
    dimensions: { length: 20, width: 20 },
    notes: '',
    customLineItems: []
  },
  exteriorOptions: {
    siding: { needed: false, type: 'vinyl', squareFeet: 2000 },
    roof: { needed: false, type: 'asphalt', squareFeet: 1500 },
    windows: { needed: false, type: 'vinyl', count: 12 },
    landscaping: { needed: false, type: 'basic', squareFeet: 5000 },
    driveway: { needed: false, type: 'asphalt', squareFeet: 800 },
    hvac: { needed: false, type: 'standard', tonnage: 3 },
    dimensions: { perimeter: 160, lotSize: 10000 },
    notes: '',
    customLineItems: []
  },
  hallwayOptions: {
    paint: { needed: false, type: 'standard', squareFeet: 160 },
    flooring: { needed: false, type: 'hardwood', squareFeet: 40 },
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
  },
  bedroomOptionsMap: {
    1: {
      paint: { needed: false, type: 'standard', squareFeet: 500 },
      flooring: { needed: false, type: 'carpet', squareFeet: 200 },
      closet: { needed: false, type: 'walk-in', squareFeet: 64 },
      lighting: { needed: false, type: 'ceiling', count: 2 },
      windows: { needed: false, type: 'standard', count: 3 },
      dimensions: { length: 16, width: 14 },
      trim: { needed: false, type: 'baseboards', linearFeet: 60 },
      fan: { needed: false, type: '52-inch', count: 1 },
      notes: '',
      customLineItems: []
    },
    2: {
      paint: { needed: false, type: 'standard', squareFeet: 400 },
      flooring: { needed: false, type: 'carpet', squareFeet: 144 },
      closet: { needed: false, type: 'basic', squareFeet: 16 },
      lighting: { needed: false, type: 'ceiling', count: 1 },
      windows: { needed: false, type: 'standard', count: 2 },
      dimensions: { length: 12, width: 12 },
      trim: { needed: false, type: 'baseboards', linearFeet: 48 },
      fan: { needed: false, type: '52-inch', count: 1 },
      notes: '',
      customLineItems: []
    }
  },
  bathroomOptionsMap: {
    1: {
      paint: { needed: false, type: 'standard', squareFeet: 300 },
      flooring: { needed: false, type: 'tile', squareFeet: 120 },
      vanity: { needed: false, type: 'custom', linearFeet: 6 },
      shower: { needed: false, type: 'walk-in', squareFeet: 16 },
      toilet: { needed: false, type: 'comfort-height' },
      lighting: { needed: false, type: 'vanity', count: 3 },
      dimensions: { length: 12, width: 10 },
      tile: { needed: false, type: 'porcelain', squareFeet: 100 },
      notes: '',
      customLineItems: []
    },
    2: {
      paint: { needed: false, type: 'standard', squareFeet: 200 },
      flooring: { needed: false, type: 'vinyl', squareFeet: 48 },
      vanity: { needed: false, type: 'basic', linearFeet: 3 },
      shower: { needed: false, type: 'standard', squareFeet: 9 },
      toilet: { needed: false, type: 'standard' },
      lighting: { needed: false, type: 'basic', count: 2 },
      dimensions: { length: 8, width: 6 },
      tile: { needed: false, type: 'ceramic', squareFeet: 60 },
      notes: '',
      customLineItems: []
    }
  },
  selectedRoom: null
};

// Create the context
const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null
});

// Define the reducer function
function projectReducer(state: ProjectState, action: Action): ProjectState {
  switch (action.type) {
    case 'UPDATE_PROPERTY_DETAILS':
      return {
        ...state,
        propertyDetails: action.payload
      };

    case 'UPDATE_FIXED_ROOMS':
      return {
        ...state,
        fixedRooms: action.payload.filter(room => room.name !== 'Doors')
      };

    case 'UPDATE_BEDROOMS':
      return {
        ...state,
        bedrooms: action.payload
      };

    case 'UPDATE_BATHROOMS':
      return {
        ...state,
        bathrooms: action.payload
      };

    case 'ADD_BEDROOM': {
      const newId = Math.max(0, ...state.bedrooms.map(room => room.id)) + 1;
      const newBedroom: IndividualRoom = {
        id: newId,
        name: action.payload.name,
        type: 'bedroom',
        customized: false,
        cost: 0
      };
      return {
        ...state,
        bedrooms: [...state.bedrooms, newBedroom],
        bedroomOptionsMap: {
          ...state.bedroomOptionsMap,
          [newId]: {
            flooring: { needed: false, type: 'carpet', squareFeet: 144 },
            paint: { needed: false, type: 'standard', squareFeet: 400 },
            closet: { needed: false, type: 'basic', squareFeet: 16 },
            lighting: { needed: false, type: 'ceiling', count: 1 },
            windows: { needed: false, type: 'standard', count: 2 },
            dimensions: { length: 12, width: 12 },
            trim: { needed: false, type: 'baseboards', linearFeet: 48 },
            fan: { needed: false, type: '52-inch', count: 1 },
            notes: '',
            customLineItems: []
          }
        }
      };
    }

    case 'DELETE_BEDROOM': {
      const newBedroomOptionsMap = { ...state.bedroomOptionsMap };
      delete newBedroomOptionsMap[action.payload.id];
      return {
        ...state,
        bedrooms: state.bedrooms.filter(room => room.id !== action.payload.id),
        bedroomOptionsMap: newBedroomOptionsMap
      };
    }

    case 'ADD_BATHROOM': {
      const newId = Math.max(0, ...state.bathrooms.map(room => room.id)) + 1;
      const newBathroom: IndividualRoom = {
        id: newId,
        name: action.payload.name,
        type: 'bathroom',
        customized: false,
        cost: 0
      };
      return {
        ...state,
        bathrooms: [...state.bathrooms, newBathroom],
        bathroomOptionsMap: {
          ...state.bathroomOptionsMap,
          [newId]: {
            flooring: { needed: false, type: 'vinyl', squareFeet: 48 },
            vanity: { needed: false, type: 'basic', linearFeet: 3 },
            shower: { needed: false, type: 'standard', squareFeet: 9 },
            toilet: { needed: false, type: 'standard' },
            lighting: { needed: false, type: 'basic', count: 2 },
            dimensions: { length: 8, width: 6 },
            tile: { needed: false, type: 'ceramic', squareFeet: 60 },
            notes: '',
            customLineItems: []
          }
        }
      };
    }

    case 'DELETE_BATHROOM': {
      const newBathroomOptionsMap = { ...state.bathroomOptionsMap };
      delete newBathroomOptionsMap[action.payload.id];
      return {
        ...state,
        bathrooms: state.bathrooms.filter(room => room.id !== action.payload.id),
        bathroomOptionsMap: newBathroomOptionsMap
      };
    }

    case 'ADD_CUSTOM_ROOM': {
      const newId = Math.max(0, ...state.customRooms.map(room => room.id), 0) + 1;
      const newRoom: Room = {
        id: newId,
        name: action.payload.name,
        customized: true,
        cost: 0,
        isCustomRoom: true,
        options: action.payload.options
      };
      return {
        ...state,
        customRooms: [...state.customRooms, newRoom]
      };
    }

    case 'EDIT_CUSTOM_ROOM': {
      return {
        ...state,
        customRooms: state.customRooms.map(room => 
          room.id === action.payload.id 
            ? { ...room, name: action.payload.name, options: action.payload.options } 
            : room
        )
      };
    }

    case 'DELETE_CUSTOM_ROOM': {
      return {
        ...state,
        customRooms: state.customRooms.filter(room => room.id !== action.payload.id)
      };
    }

    case 'UPDATE_ROOM_CUSTOMIZATION': {
      const { roomType, roomId, isCustomized } = action.payload;
      
      switch (roomType) {
        case 'fixed':
          return {
            ...state,
            fixedRooms: state.fixedRooms.map(room =>
              room.id === roomId ? { ...room, customized: isCustomized } : room
            )
          };
        case 'bedroom':
          return {
            ...state,
            bedrooms: state.bedrooms.map(room =>
              room.id === roomId ? { ...room, customized: isCustomized } : room
            )
          };
        case 'bathroom':
          return {
            ...state,
            bathrooms: state.bathrooms.map(room =>
              room.id === roomId ? { ...room, customized: isCustomized } : room
            )
          };
        case 'custom':
          return {
            ...state,
            customRooms: state.customRooms.map(room =>
              room.id === roomId ? { ...room, customized: isCustomized } : room
            )
          };
        default:
          return state;
      }
    }

    case 'UPDATE_KITCHEN_OPTIONS':
      return {
        ...state,
        kitchenOptions: action.payload
      };

    case 'UPDATE_LIVING_ROOM_OPTIONS':
      return {
        ...state,
        livingRoomOptions: action.payload
      };

    case 'UPDATE_FAMILY_ROOM_OPTIONS':
      return {
        ...state,
        familyRoomOptions: action.payload
      };

    case 'UPDATE_DINING_ROOM_OPTIONS':
      return {
        ...state,
        diningRoomOptions: action.payload
      };

    case 'UPDATE_FOYER_OPTIONS':
      return {
        ...state,
        foyerOptions: action.payload
      };

    case 'UPDATE_LAUNDRY_ROOM_OPTIONS':
      return {
        ...state,
        laundryRoomOptions: action.payload
      };

    case 'UPDATE_GARAGE_OPTIONS':
      return {
        ...state,
        garageOptions: action.payload
      };

    case 'UPDATE_EXTERIOR_OPTIONS':
      return {
        ...state,
        exteriorOptions: action.payload
      };

    case 'UPDATE_HALLWAY_OPTIONS':
      return {
        ...state,
        hallwayOptions: action.payload
      };

    case 'UPDATE_BEDROOM_OPTIONS':
      return {
        ...state,
        bedroomOptionsMap: {
          ...state.bedroomOptionsMap,
          [action.payload.id]: action.payload.options
        }
      };

    case 'UPDATE_BATHROOM_OPTIONS':
      return {
        ...state,
        bathroomOptionsMap: {
          ...state.bathroomOptionsMap,
          [action.payload.id]: action.payload.options
        }
      };

    case 'UPDATE_SELECTED_ROOM':
      return {
        ...state,
        selectedRoom: action.payload
      };

    case 'LOAD_PROJECT':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Create the provider component
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Create a custom hook for using the project context
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};