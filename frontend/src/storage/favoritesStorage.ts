import { getItem, removeItem, setItem } from "./asyncStorage";

export const FAVORITES_STORAGE_KEY = "@eventgo/favorite_event_ids";

/**
 * Retrieves the list of favorite event IDs stored locally.
 */
export async function getFavoriteIds(): Promise<string[]> {
  try {
    const ids = await getItem<string[]>(FAVORITES_STORAGE_KEY);
    return ids ?? [];
  } catch (error) {
    console.error("[favoritesStorage] Error getting favorite IDs:", error);
    throw error;
  }
}

/**
 * Adds an event ID to the favorites list, preventing duplicates.
 * Returns the updated list of favorite IDs.
 */
export async function addFavorite(eventId: string): Promise<string[]> {
  try {
    const currentIds = await getFavoriteIds();
    if (!currentIds.includes(eventId)) {
      const updatedIds = [...currentIds, eventId];
      await setItem(FAVORITES_STORAGE_KEY, updatedIds);
      return updatedIds;
    }
    return currentIds;
  } catch (error) {
    console.error(`[favoritesStorage] Error adding favorite ${eventId}:`, error);
    throw error;
  }
}

/**
 * Removes an event ID from the favorites list.
 * Returns the updated list of favorite IDs.
 */
export async function removeFavorite(eventId: string): Promise<string[]> {
  try {
    const currentIds = await getFavoriteIds();
    const updatedIds = currentIds.filter((id) => id !== eventId);
    await setItem(FAVORITES_STORAGE_KEY, updatedIds);
    return updatedIds;
  } catch (error) {
    console.error(`[favoritesStorage] Error removing favorite ${eventId}:`, error);
    throw error;
  }
}

/**
 * Checks whether an event ID is currently in the favorites list.
 */
export async function isFavorite(eventId: string): Promise<boolean> {
  try {
    const currentIds = await getFavoriteIds();
    return currentIds.includes(eventId);
  } catch (error) {
    console.error(`[favoritesStorage] Error checking if ${eventId} is favorite:`, error);
    throw error;
  }
}

/**
 * Clears all locally stored favorite event IDs.
 */
export async function clearFavorites(): Promise<void> {
  try {
    await removeItem(FAVORITES_STORAGE_KEY);
  } catch (error) {
    console.error("[favoritesStorage] Error clearing favorites:", error);
    throw error;
  }
}
