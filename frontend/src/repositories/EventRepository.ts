import * as eventService from "../services/eventService";
import * as eventCache from "../storage/eventCacheStorage";
import {
  CreateEventInput,
  EventItem,
  UpdateEventInput,
} from "../types/event.types";

/**
 * EventRepository
 * Provides an offline-first data layer for Events:
 * - Attempts live Firestore fetch first.
 * - Caches data locally upon successful network response.
 * - Gracefully falls back to local cache when offline / network fails.
 */

/**
 * Retrieves all events (Firestore first, falling back to local cache).
 */
export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const events = await eventService.getAllEvents();
    // Cache the fresh list in the background
    try {
      await eventCache.cacheEvents(events);
    } catch (cacheErr) {
      console.warn("[EventRepository] Failed to update local events cache:", cacheErr);
    }
    return events;
  } catch (networkError) {
    console.warn(
      "[EventRepository] Network error fetching all events from Firestore, falling back to local cache:",
      networkError
    );
    try {
      const cachedEvents = await eventCache.getCachedEvents();
      if (cachedEvents && cachedEvents.length > 0) {
        return cachedEvents;
      }
    } catch (cacheErr) {
      console.error("[EventRepository] Error reading cached events fallback:", cacheErr);
    }
    // If no cache exists, rethrow the original network error
    throw networkError;
  }
}

/**
 * Retrieves a single event by ID (Firestore first, falling back to local cache).
 */
export async function getEventById(eventId: string): Promise<EventItem | null> {
  try {
    const event = await eventService.getEventById(eventId);
    if (event) {
      // Update individual cache
      try {
        await eventCache.cacheEvent(event);
      } catch (cacheErr) {
        console.warn(`[EventRepository] Failed to cache event ${eventId}:`, cacheErr);
      }
    }
    return event;
  } catch (networkError) {
    console.warn(
      `[EventRepository] Network error fetching event ${eventId} from Firestore, falling back to local cache:`,
      networkError
    );
    try {
      const cachedEvent = await eventCache.getCachedEvent(eventId);
      if (cachedEvent) {
        return cachedEvent;
      }
    } catch (cacheErr) {
      console.error(`[EventRepository] Error reading cached event fallback for ${eventId}:`, cacheErr);
    }
    // If no individual cache exists, rethrow the original network error
    throw networkError;
  }
}

/**
 * Creates a new event in Firestore and saves it to the local cache.
 */
export async function createEvent(
  eventData: CreateEventInput
): Promise<EventItem> {
  try {
    const createdEvent = await eventService.createEvent(eventData);
    try {
      await eventCache.cacheEvent(createdEvent);
    } catch (cacheErr) {
      console.warn("[EventRepository] Failed to cache newly created event:", cacheErr);
    }
    return createdEvent;
  } catch (error) {
    console.error("[EventRepository] Error creating event:", error);
    throw error;
  }
}

/**
 * Updates an event in Firestore and refreshes the local cache.
 */
export async function updateEvent(
  eventId: string,
  updates: UpdateEventInput
): Promise<void> {
  try {
    await eventService.updateEvent(eventId, updates);
    // Refresh individual cached event if available
    try {
      const updatedEvent = await eventService.getEventById(eventId);
      if (updatedEvent) {
        await eventCache.cacheEvent(updatedEvent);
      }
    } catch (refreshErr) {
      console.warn(`[EventRepository] Failed to refresh cached event ${eventId} after update:`, refreshErr);
    }
  } catch (error) {
    console.error(`[EventRepository] Error updating event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Deletes an event in Firestore and removes it from the local cache.
 */
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    await eventService.deleteEvent(eventId);
    try {
      await eventCache.removeCachedEvent(eventId);
    } catch (cacheErr) {
      console.warn(`[EventRepository] Failed to remove cached event ${eventId} after delete:`, cacheErr);
    }
  } catch (error) {
    console.error(`[EventRepository] Error deleting event ${eventId}:`, error);
    throw error;
  }
}
