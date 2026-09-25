import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../config/firebase";
import {
  CreateRegistrationInput,
  Registration,
} from "../types/registration.types";

export const REGISTRATIONS_COLLECTION = "registrations";

/**
 * Creates a new registration document in Firestore.
 */
export async function createRegistration(
  registrationData: CreateRegistrationInput
): Promise<Registration> {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const newDocData = {
      ...registrationData,
      status: registrationData.status ?? "confirmed",
      registeredAt: new Date().toISOString(),
    };

    const docRef = await addDoc(registrationsRef, newDocData);

    return {
      id: docRef.id,
      ...newDocData,
    };
  } catch (error) {
    console.error("[registrationService] Error creating registration:", error);
    throw error;
  }
}

/**
 * Retrieves a single registration document by its ID.
 */
export async function getRegistrationById(
  registrationId: string
): Promise<Registration | null> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<Registration, "id">),
    };
  } catch (error) {
    console.error(
      `[registrationService] Error fetching registration ${registrationId}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all registrations for a specific user.
 */
export async function getRegistrationsByUser(
  userId: string
): Promise<Registration[]> {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const registrations: Registration[] = [];
    querySnapshot.forEach((docSnap) => {
      registrations.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Registration, "id">),
      });
    });

    return registrations;
  } catch (error) {
    console.error(
      `[registrationService] Error fetching registrations for user ${userId}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all registrations for a specific event.
 */
export async function getRegistrationsByEvent(
  eventId: string
): Promise<Registration[]> {
  try {
    const registrationsRef = collection(db, REGISTRATIONS_COLLECTION);
    const q = query(registrationsRef, where("eventId", "==", eventId));
    const querySnapshot = await getDocs(q);

    const registrations: Registration[] = [];
    querySnapshot.forEach((docSnap) => {
      registrations.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Registration, "id">),
      });
    });

    return registrations;
  } catch (error) {
    console.error(
      `[registrationService] Error fetching registrations for event ${eventId}:`,
      error
    );
    throw error;
  }
}

/**
 * Updates specific fields of an existing registration (e.g. status changes).
 */
export async function updateRegistration(
  registrationId: string,
  updates: Partial<Omit<Registration, "id">>
): Promise<void> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error(
      `[registrationService] Error updating registration ${registrationId}:`,
      error
    );
    throw error;
  }
}

/**
 * Deletes a registration document from Firestore.
 */
export async function deleteRegistration(
  registrationId: string
): Promise<void> {
  try {
    const docRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(
      `[registrationService] Error deleting registration ${registrationId}:`,
      error
    );
    throw error;
  }
}
