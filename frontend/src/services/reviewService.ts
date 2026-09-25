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
  CreateReviewInput,
  Review,
  UpdateReviewInput,
} from "../types/review.types";

export const REVIEWS_COLLECTION = "reviews";

/**
 * Creates a new event review in Firestore.
 */
export async function createReview(
  reviewData: CreateReviewInput
): Promise<Review> {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const newDocData = {
      ...reviewData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(reviewsRef, newDocData);

    return {
      id: docRef.id,
      ...newDocData,
    };
  } catch (error) {
    console.error("[reviewService] Error creating review:", error);
    throw error;
  }
}

/**
 * Retrieves a single review by document ID.
 */
export async function getReviewById(
  reviewId: string
): Promise<Review | null> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...(docSnap.data() as Omit<Review, "id">),
    };
  } catch (error) {
    console.error(
      `[reviewService] Error fetching review ${reviewId}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all reviews for a specific event.
 */
export async function getReviewsByEvent(
  eventId: string
): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(reviewsRef, where("eventId", "==", eventId));
    const querySnapshot = await getDocs(q);

    const reviews: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      reviews.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Review, "id">),
      });
    });

    return reviews;
  } catch (error) {
    console.error(
      `[reviewService] Error fetching reviews for event ${eventId}:`,
      error
    );
    throw error;
  }
}

/**
 * Retrieves all reviews submitted by a specific user.
 */
export async function getReviewsByUser(
  userId: string
): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION);
    const q = query(reviewsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const reviews: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      reviews.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Review, "id">),
      });
    });

    return reviews;
  } catch (error) {
    console.error(
      `[reviewService] Error fetching reviews for user ${userId}:`,
      error
    );
    throw error;
  }
}

/**
 * Updates specific fields of an existing review (rating or comment).
 */
export async function updateReview(
  reviewId: string,
  updates: UpdateReviewInput
): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error(
      `[reviewService] Error updating review ${reviewId}:`,
      error
    );
    throw error;
  }
}

/**
 * Deletes a review document from Firestore.
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(
      `[reviewService] Error deleting review ${reviewId}:`,
      error
    );
    throw error;
  }
}
