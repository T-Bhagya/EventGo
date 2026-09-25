import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Serializes and saves any value to AsyncStorage.
 */
export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error(`[asyncStorage] Error setting item for key "${key}":`, error);
    throw error;
  }
}

/**
 * Retrieves and deserializes a JSON value from AsyncStorage.
 * Returns null if the key does not exist or has an empty value.
 */
export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue === null || jsonValue === undefined) {
      return null;
    }
    return JSON.parse(jsonValue) as T;
  } catch (error) {
    console.error(`[asyncStorage] Error getting item for key "${key}":`, error);
    throw error;
  }
}

/**
 * Removes a specific key from AsyncStorage.
 */
export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`[asyncStorage] Error removing item for key "${key}":`, error);
    throw error;
  }
}

/**
 * Clears all data stored in AsyncStorage.
 */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("[asyncStorage] Error clearing AsyncStorage:", error);
    throw error;
  }
}
