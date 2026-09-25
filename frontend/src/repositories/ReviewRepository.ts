import * as reviewService from "../services/reviewService";
import {
  CreateReviewInput,
  Review,
  UpdateReviewInput,
} from "../types/review.types";

/**
 * ReviewRepository
 * Provides clean data access for Event Reviews.
 */

export async function createReview(
  reviewData: CreateReviewInput
): Promise<Review> {
  return reviewService.createReview(reviewData);
}

export async function getReviewById(
  reviewId: string
): Promise<Review | null> {
  return reviewService.getReviewById(reviewId);
}

export async function getReviewsByEvent(
  eventId: string
): Promise<Review[]> {
  return reviewService.getReviewsByEvent(eventId);
}

export async function getReviewsByUser(
  userId: string
): Promise<Review[]> {
  return reviewService.getReviewsByUser(userId);
}

export async function updateReview(
  reviewId: string,
  updates: UpdateReviewInput
): Promise<void> {
  return reviewService.updateReview(reviewId, updates);
}

export async function deleteReview(reviewId: string): Promise<void> {
  return reviewService.deleteReview(reviewId);
}
