/**
 * Cache utility for API responses
 * Provides in-memory and persistent caching with TTL
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache configuration
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_PREFIX = 'api_cache_';

// Memory cache for faster access
const memoryCache: Record<string, {
  value: any;
  expiry: number;
}> = {};

/**
 * Generates a cache key from parameters
 * @param baseKey - Base key for the cache entry
 * @param params - Parameters to include in the cache key
 * @returns Cache key string
 */
export const generateCacheKey = (baseKey: string, params?: any): string => {
  if (!params) {
    return baseKey;
  }
  
  // Sort keys for consistent cache keys regardless of param order
  const sortedParams = typeof params === 'object' ? 
    Object.keys(params).sort().reduce((result: Record<string, any>, key) => {
      result[key] = params[key];
      return result;
    }, {}) : 
    params;
    
  return `${baseKey}:${JSON.stringify(sortedParams)}`;
};

/**
 * Gets a value from cache
 * @param key - Cache key
 * @param useMemoryCache - Whether to check memory cache first (default: true)
 * @returns Cached value or null if not found or expired
 */
export const getCachedData = async <T>(key: string, useMemoryCache = true): Promise<T | null> => {
  // Check memory cache first if enabled
  if (useMemoryCache && memoryCache[key]) {
    const { value, expiry } = memoryCache[key];
    
    // Check if memory cache is expired
    if (expiry > Date.now()) {
      return value as T;
    }
    
    // Clear expired memory cache
    delete memoryCache[key];
  }
  
  // Check persistent cache
  try {
    const storedData = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    
    if (!storedData) {
      return null;
    }
    
    const { value, expiry } = JSON.parse(storedData);
    
    // Check if persistent cache is expired
    if (expiry > Date.now()) {
      // Also update memory cache
      if (useMemoryCache) {
        memoryCache[key] = { value, expiry };
      }
      
      return value as T;
    }
    
    // Clear expired persistent cache
    await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Error retrieving from cache:', error);
  }
  
  return null;
};

/**
 * Sets a value in cache
 * @param key - Cache key
 * @param value - Value to cache
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 * @param useMemoryCache - Whether to store in memory cache (default: true)
 * @param usePersistentCache - Whether to store in persistent cache (default: true)
 */
export const setCachedData = async <T>(
  key: string, 
  value: T, 
  ttl = DEFAULT_TTL,
  useMemoryCache = true,
  usePersistentCache = true
): Promise<void> => {
  const expiry = Date.now() + ttl;
  
  // Update memory cache
  if (useMemoryCache) {
    memoryCache[key] = { value, expiry };
  }
  
  // Update persistent cache
  if (usePersistentCache) {
    try {
      await AsyncStorage.setItem(
        `${CACHE_PREFIX}${key}`,
        JSON.stringify({ value, expiry })
      );
    } catch (error) {
      console.error('Error storing in cache:', error);
    }
  }
};

/**
 * Removes a value from cache
 * @param key - Cache key
 * @param useMemoryCache - Whether to remove from memory cache (default: true)
 * @param usePersistentCache - Whether to remove from persistent cache (default: true)
 */
export const removeCachedData = async (
  key: string,
  useMemoryCache = true,
  usePersistentCache = true
): Promise<void> => {
  if (useMemoryCache) {
    delete memoryCache[key];
  }
  
  if (usePersistentCache) {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }
};

/**
 * Clears all cached data
 * @param clearMemoryCache - Whether to clear memory cache (default: true)
 * @param clearPersistentCache - Whether to clear persistent cache (default: true)
 */
export const clearCache = async (
  clearMemoryCache = true,
  clearPersistentCache = true
): Promise<void> => {
  // Clear memory cache
  if (clearMemoryCache) {
    Object.keys(memoryCache).forEach(key => {
      delete memoryCache[key];
    });
  }
  
  // Clear persistent cache
  if (clearPersistentCache) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};

/**
 * Creates a cached version of an async function
 * @param fn - Async function to cache
 * @param keyFn - Function to generate cache key (default: uses function name and args)
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 * @returns Cached function
 */
export const createCachedFunction = <T, A extends any[]>(
  fn: (...args: A) => Promise<T>,
  keyFn: (...args: A) => string = (...args) => generateCacheKey(fn.name, args),
  ttl = DEFAULT_TTL
): ((...args: A) => Promise<T>) => {
  return async (...args: A): Promise<T> => {
    const cacheKey = keyFn(...args);
    
    // Try to get from cache
    const cachedResult = await getCachedData<T>(cacheKey);
    if (cachedResult !== null) {
      return cachedResult;
    }
    
    // If not in cache, execute function
    const result = await fn(...args);
    
    // Store result in cache
    await setCachedData<T>(cacheKey, result, ttl);
    
    return result;
  };
}; 