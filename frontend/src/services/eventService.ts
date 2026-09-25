import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";
import {
  CreateEventInput,
  EventItem,
  UpdateEventInput,
} from "../types/event.types";

export const EVENTS_COLLECTION = "events";

/**
 * Creates a new event in Firestore.
 */
export async function createEvent(
  eventData: CreateEventInput
): Promise<EventItem> {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const newEventData = {
      ...eventData,
      attendeesCount: eventData.attendeesCount ?? 0,
      rating: 0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(eventsRef, newEventData);

    return {
      id: docRef.id,
      ...newEventData,
    };
  } catch (error) {
    console.error("[eventService] Error creating event:", error);
    throw error;
  }
}

/**
 * Retrieves a single event by its Firestore document ID.
 */
export async function getEventById(
  eventId: string
): Promise<EventItem | null> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<EventItem, "id">),
    };
  } catch (error) {
    console.error(`[eventService] Error fetching event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Retrieves all events from Firestore.
 */
export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const eventsRef = collection(db, EVENTS_COLLECTION);
    const querySnapshot = await getDocs(eventsRef);

    const events: EventItem[] = [];
    querySnapshot.forEach((docSnap) => {
      events.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<EventItem, "id">),
      });
    });

    return events;
  } catch (error) {
    console.error("[eventService] Error fetching all events:", error);
    throw error;
  }
}

/**
 * Updates an existing event document in Firestore.
 */
export async function updateEvent(
  eventId: string,
  updates: UpdateEventInput
): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error(`[eventService] Error updating event ${eventId}:`, error);
    throw error;
  }
}

/**
 * Deletes an event document from Firestore.
 */
export async function deleteEvent(eventId: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`[eventService] Error deleting event ${eventId}:`, error);
    throw error;
  }
}
