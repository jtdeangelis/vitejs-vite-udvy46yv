import { Room, IndividualRoom } from '../types';

interface CostCache {
  [key: string]: {
    cost: number;
    timestamp: number;
    hash: string;
  };
}

const cache: CostCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generate a hash of the room options to detect changes
const generateOptionsHash = (options: any): string => {
  return JSON.stringify(options);
};

// Check if cached cost is still valid
const isCacheValid = (cacheEntry: { timestamp: number, hash: string }, currentHash: string): boolean => {
  const now = Date.now();
  return (
    now - cacheEntry.timestamp < CACHE_DURATION && 
    cacheEntry.hash === currentHash
  );
};

export const getCachedCost = (room: Room | IndividualRoom): number | null => {
  if (!room.options) return null;

  const currentHash = generateOptionsHash(room.options);
  const cacheKey = `${room.id}-${room.type || 'room'}`;
  const cacheEntry = cache[cacheKey];

  if (cacheEntry && isCacheValid(cacheEntry, currentHash)) {
    return cacheEntry.cost;
  }

  return null;
};

export const setCachedCost = (room: Room | IndividualRoom, cost: number): void => {
  if (!room.options) return;

  const cacheKey = `${room.id}-${room.type || 'room'}`;
  cache[cacheKey] = {
    cost,
    timestamp: Date.now(),
    hash: generateOptionsHash(room.options)
  };
};

export const clearCache = (): void => {
  Object.keys(cache).forEach(key => delete cache[key]);
};