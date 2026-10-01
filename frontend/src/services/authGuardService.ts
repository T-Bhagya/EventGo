import { EventItem } from "../types/event.types";
import { UserProfile, UserRole } from "../types/user.types";

/**
 * Checks if the user is a Participant / Attendee.
 */
export function isParticipant(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.role === "attendee";
}

/**
 * Checks if the user is an Organizer.
 */
export function isOrganizer(user: UserProfile | null): boolean {
  if (!user) return false;
  return user.role === "organizer";
}

/**
 * Validates whether the user can access organizer-restricted features.
 */
export function canAccessOrganizerFeature(user: UserProfile | null): {
  allowed: boolean;
  reason?: string;
} {
  if (!user) {
    return {
      allowed: false,
      reason: "Authentication required. Please sign in as an organizer.",
    };
  }

  if (user.role !== "organizer") {
    return {
      allowed: false,
      reason: "Access denied. Only registered event organizers can perform this action.",
    };
  }

  return { allowed: true };
}

/**
 * Validates whether the user can access participant-oriented features (e.g. registration).
 */
export function canAccessParticipantFeature(user: UserProfile | null): {
  allowed: boolean;
  reason?: string;
} {
  if (!user) {
    return {
      allowed: false,
      reason: "Authentication required. Please sign in to continue.",
    };
  }

  if (user.role !== "attendee") {
    return {
      allowed: false,
      reason: "Organizer accounts cannot register as attendees for events.",
    };
  }

  return { allowed: true };
}

/**
 * Validates whether the user has permission to manage (edit, cancel, view attendees of) a specific event.
 */
export function canManageEvent(
  user: UserProfile | null,
  event: EventItem
): {
  allowed: boolean;
  reason?: string;
} {
  const organizerCheck = canAccessOrganizerFeature(user);
  if (!organizerCheck.allowed) {
    return organizerCheck;
  }

  if (event.organizerId !== user?.uid) {
    return {
      allowed: false,
      reason: "Permission denied. You can only manage events you created.",
    };
  }

  return { allowed: true };
}

/**
 * Checks whether the user is eligible role-wise to register for an event.
 */
export function canRegisterForEvent(user: UserProfile | null): {
  allowed: boolean;
  reason?: string;
} {
  return canAccessParticipantFeature(user);
}
