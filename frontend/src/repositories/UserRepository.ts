import * as userService from "../services/userService";
import {
  CreateUserInput,
  UpdateUserInput,
  UserProfile,
} from "../types/user.types";

/**
 * UserRepository
 * Provides clean data access for User Profiles.
 */

export async function createUserProfile(
  userProfile: CreateUserInput
): Promise<UserProfile> {
  return userService.createUserProfile(userProfile);
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  return userService.getUserProfile(userId);
}

export async function updateUserProfile(
  userId: string,
  updates: UpdateUserInput
): Promise<void> {
  return userService.updateUserProfile(userId, updates);
}

export async function deleteUserProfile(userId: string): Promise<void> {
  return userService.deleteUserProfile(userId);
}
