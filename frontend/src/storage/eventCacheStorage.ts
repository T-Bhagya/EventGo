import { getItem, removeItem, setItem } from "./asyncStorage";
import { EventItem } from "../types/event.types";

export const CACHED_EVENTS_KEY = "@eventgo/cached_events";
export const CACHED_EVENT_PREFIX = "@eventgo/cached_event_";

/**
 * Returns the storage key for an individual cached event.
 */
function getSingleEventKey(eventId: string): string {
  return `${CACHED_EVENT_PREFIX}${eventId}`;
}

/**
 * Caches a full list of events.
 */
export async function cacheEvents(events: EventItem[]): Promise<void> {
  try {
    await setItem(CACHED_EVENTS_KEY, events);
  } catch (error) {
    console.error("[eventCacheStorage] Error caching events list:", error);
    throw error;
  }
}

/**
 * Retrieves the full list of cached events. Returns an empty array if no cache exists.
 */
export async function getCachedEvents(): Promise<EventItem[]> {
  try {
    const cached = await getItem<EventItem[]>(CACHED_EVENTS_KEY);
    return cached ?? [];
  } catch (error) {
    console.error("[eventCacheStorage] Error getting cached events:", error);
    throw error;
  }
}

/**
 * Caches an individual event by its ID.
 */
export async function cacheEvent(event: EventItem): Promise<void> {
  try {
    const key = getSingleEventKey(event.id);
    await setItem(key, event);
  } catch (error) {
    console.error(`[eventCacheStorage] Error caching event ${event.id}:`, error);
    throw error;
  }
}

/**
 * Retrieves a single cached event by its ID.
 * Returns null if the individual cached event does not exist.
 */
export async function getCachedEvent(eventId: string): Promise<EventItem | null> {
  try {
    const key = getSingleEventKey(eventId);
    const cached = await getItem<EventItem>(key);
    return cached ?? null;
  } catch (error) {
    console.error(`[eventCacheStorage] Error getting cached event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Removes an individual cached event by ID.
 */
export async function removeCachedEvent(eventId: string): Promise<void> {
  try {
    const key = getSingleEventKey(eventId);
    await removeItem(key);
  } catch (error) {
    console.error(`[eventCacheStorage] Error removing cached event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Clears the full list event cache.
 */
export async function clearEventCache(): Promise<void> {
  try {
    await removeItem(CACHED_EVENTS_KEY);
  } catch (error) {
    console.error("[eventCacheStorage] Error clearing events cache:", error);
    throw error;
  }
}
