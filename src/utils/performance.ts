import { debounce } from 'lodash';

// Cache for memoized values
const memoCache = new Map();

// Memoization with TTL
export const memoizeWithTTL = <T>(
  fn: (...args: any[]) => T,
  ttl: number = 5000
) => {
  return (...args: any[]): T => {
    const key = JSON.stringify(args);
    const cached = memoCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.value;
    }
    
    const result = fn(...args);
    memoCache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
};

// Debounced function with cancel capability
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  fn: T,
  wait: number = 300
) => {
  const debouncedFn = debounce(fn, wait);
  return {
    execute: debouncedFn,
    cancel: debouncedFn.cancel
  };
};

// Measure function execution time
export const measurePerformance = async <T>(
  fn: () => Promise<T> | T,
  name: string
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`${name} took ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`${name} failed after ${duration.toFixed(2)}ms:`, error);
    throw error;
  }
};

// Chunk array processing
export const processInChunks = <T, R>(
  items: T[],
  processor: (item: T) => R,
  chunkSize: number = 100
): Promise<R[]> => {
  return new Promise((resolve) => {
    const results: R[] = [];
    let index = 0;

    function processNextChunk() {
      const chunk = items.slice(index, index + chunkSize);
      chunk.forEach(item => {
        results.push(processor(item));
      });
      
      index += chunkSize;
      
      if (index < items.length) {
        setTimeout(processNextChunk, 0);
      } else {
        resolve(results);
      }
    }

    processNextChunk();
  });
};

// Request idle callback wrapper
export const scheduleIdleTask = (
  task: () => void,
  timeout: number = 2000
): number => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(task, { timeout });
  }
  return window.setTimeout(task, 1);
};

// Cancel idle task
export const cancelIdleTask = (id: number): void => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    window.clearTimeout(id);
  }
};

// Clear memo cache
export const clearMemoCache = (): void => {
  memoCache.clear();
};