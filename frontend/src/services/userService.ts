import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../config/firebase";
import {
  CreateUserInput,
  UpdateUserInput,
  UserProfile,
} from "../types/user.types";

export const USERS_COLLECTION = "users";

/**
 * Creates or overwrites a user profile document in Firestore.
 * The document ID is set explicitly to the user's uid.
 */
export async function createUserProfile(
  userProfile: CreateUserInput
): Promise<UserProfile> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userProfile.uid);
    const newProfileData: UserProfile = {
      ...userProfile,
      createdAt: new Date().toISOString(),
    };

    await setDoc(userDocRef, newProfileData);

    return newProfileData;
  } catch (error) {
    console.error(`[userService] Error creating profile for uid ${userProfile.uid}:`, error);
    throw error;
  }
}

/**
 * Retrieves a user profile by user UID from Firestore.
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as Omit<UserProfile, "uid">;
    return {
      uid: docSnap.id,
      ...data,
    };
  } catch (error) {
    console.error(`[userService] Error fetching profile for uid ${userId}:`, error);
    throw error;
  }
}

/**
 * Updates specific fields of a user profile document in Firestore.
 */
export async function updateUserProfile(
  userId: string,
  updates: UpdateUserInput
): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userDocRef, updates);
  } catch (error) {
    console.error(`[userService] Error updating profile for uid ${userId}:`, error);
    throw error;
  }
}

/**
 * Deletes a user profile document from Firestore.
 */
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error(`[userService] Error deleting profile for uid ${userId}:`, error);
    throw error;
  }
}
