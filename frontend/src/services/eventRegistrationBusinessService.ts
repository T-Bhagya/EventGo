import * as registrationRepository from "../repositories/RegistrationRepository";
import { BusinessRuleResult } from "../types/auth.types";
import { EventItem } from "../types/event.types";
import { Registration } from "../types/registration.types";
import { UserProfile } from "../types/user.types";
import { canRegisterForEvent } from "./authGuardService";

/**
 * Parses and verifies whether the event date / deadline has passed.
 */
export function isEventRegistrationOpen(event: EventItem): boolean {
  try {
    const eventTimeStr = `${event.date} ${event.time || "23:59"}`;
    const eventTimestamp = new Date(eventTimeStr).getTime();
    if (isNaN(eventTimestamp)) {
      // Fallback: try parsing just the date
      const dateTimestamp = new Date(event.date).getTime();
      if (isNaN(dateTimestamp)) return true; // Graceful fallback if format cannot be parsed
      return dateTimestamp > Date.now();
    }
    return eventTimestamp > Date.now();
  } catch {
    return true;
  }
}

/**
 * Validates all 6 business rules before allowing registration.
 */
export async function checkRegistrationEligibility(
  user: UserProfile | null,
  event: EventItem
): Promise<BusinessRuleResult<boolean>> {
  // Rule 1: User must be authenticated
  if (!user || !user.uid) {
    return {
      success: false,
      code: "RULE_UNAUTHENTICATED",
      message: "You must be logged in to register for an event.",
    };
  }

  // Rule 2: Role Authorization (Only Attendees / Participants can register)
  const roleCheck = canRegisterForEvent(user);
  if (!roleCheck.allowed) {
    return {
      success: false,
      code: "RULE_UNAUTHORIZED_ROLE",
      message: roleCheck.reason || "Organizer accounts cannot register as participants.",
    };
  }

  // Rule 3: Event registerable status
  if (event.status === "cancelled") {
    return {
      success: false,
      code: "RULE_EVENT_CANCELLED",
      message: "This event has been cancelled and is no longer accepting registrations.",
    };
  }

  if (event.status === "completed") {
    return {
      success: false,
      code: "RULE_EVENT_COMPLETED",
      message: "This event has already ended.",
    };
  }

  if (event.status === "draft") {
    return {
      success: false,
      code: "RULE_EVENT_DRAFT",
      message: "This event is currently in draft mode and not open for registration.",
    };
  }

  // Rule 4: Registration Deadline
  if (!isEventRegistrationOpen(event)) {
    return {
      success: false,
      code: "RULE_DEADLINE_PASSED",
      message: "Registration for this event has closed.",
    };
  }

  // Rule 5: Duplicate registration prevention
  try {
    const userRegistrations = await registrationRepository.getRegistrationsByUser(
      user.uid
    );
    const existingRegistration = userRegistrations.find(
      (r) => r.eventId === event.id && r.status === "confirmed"
    );

    if (existingRegistration) {
      return {
        success: false,
        code: "RULE_DUPLICATE_REGISTRATION",
        message: "You are already registered for this event.",
      };
    }
  } catch (error) {
    console.error("[BusinessService] Error checking duplicate registration:", error);
    // Proceed if network fails in offline mode or propagate
  }

  // Rule 6: Event Capacity
  try {
    const eventRegistrations =
      await registrationRepository.getRegistrationsByEvent(event.id);
    const activeCount = eventRegistrations.filter(
      (r) => r.status === "confirmed"
    ).length;

    if (event.maxCapacity > 0 && activeCount >= event.maxCapacity) {
      return {
        success: false,
        code: "RULE_CAPACITY_FULL",
        message: "This event is full. No more seats are available.",
      };
    }
  } catch (error) {
    console.error("[BusinessService] Error checking capacity:", error);
  }

  // Rule 7: Eligible
  return {
    success: true,
    code: "RULE_ELIGIBLE",
    message: "Registration is open and you are eligible to register.",
    data: true,
  };
}

/**
 * Registers an authenticated user for an event after validating all business rules.
 */
export async function registerForEvent(
  user: UserProfile | null,
  event: EventItem
): Promise<BusinessRuleResult<Registration>> {
  // Validate eligibility
  const eligibility = await checkRegistrationEligibility(user, event);
  if (!eligibility.success) {
    return {
      success: false,
      code: eligibility.code,
      message: eligibility.message,
    };
  }

  try {
    const newRegistration = await registrationRepository.createRegistration({
      eventId: event.id,
      userId: user!.uid,
      status: "confirmed",
    });

    return {
      success: true,
      code: "REGISTRATION_SUCCESS",
      message: "Registration successful! You have secured your spot.",
      data: newRegistration,
    };
  } catch (error: any) {
    console.error("[BusinessService] Failed to create registration:", error);
    return {
      success: false,
      code: "REGISTRATION_FAILED",
      message: error?.message || "Failed to register for the event. Please try again.",
    };
  }
}

/**
 * Validates whether a registration is eligible for cancellation.
 */
export function checkCancellationEligibility(
  user: UserProfile | null,
  registration: Registration,
  event?: EventItem | null
): BusinessRuleResult<boolean> {
  if (!user || !user.uid) {
    return {
      success: false,
      code: "CAN_UNAUTHENTICATED",
      message: "Authentication required to cancel a registration.",
    };
  }

  if (registration.status === "cancelled") {
    return {
      success: false,
      code: "CAN_ALREADY_CANCELLED",
      message: "This registration has already been cancelled.",
    };
  }

  // Check ownership: must be the registrant or the organizer of the event
  const isOwner = registration.userId === user.uid;
  const isEventOrganizer = event && event.organizerId === user.uid;

  if (!isOwner && !isEventOrganizer) {
    return {
      success: false,
      code: "CAN_UNAUTHORIZED_OWNER",
      message: "You can only cancel your own registrations.",
    };
  }

  // Event cut-off check: cannot cancel past events
  if (event && !isEventRegistrationOpen(event)) {
    return {
      success: false,
      code: "CAN_CUTOFF_PASSED",
      message: "Cancellation cut-off has passed because the event has started or concluded.",
    };
  }

  return {
    success: true,
    code: "CAN_ELIGIBLE",
    message: "Registration is eligible for cancellation.",
    data: true,
  };
}

/**
 * Cancels an existing registration following business verification rules.
 */
export async function cancelRegistration(
  user: UserProfile | null,
  registrationId: string,
  event?: EventItem | null
): Promise<BusinessRuleResult<void>> {
  try {
    const registration = await registrationRepository.getRegistrationById(
      registrationId
    );

    if (!registration) {
      return {
        success: false,
        code: "CAN_NOT_FOUND",
        message: "Registration not found.",
      };
    }

    const check = checkCancellationEligibility(user, registration, event);
    if (!check.success) {
      return {
        success: false,
        code: check.code,
        message: check.message,
      };
    }

    await registrationRepository.updateRegistration(registrationId, {
      status: "cancelled",
    });

    return {
      success: true,
      code: "CANCELLATION_SUCCESS",
      message: "Your registration has been successfully cancelled.",
    };
  } catch (error: any) {
    console.error("[BusinessService] Failed to cancel registration:", error);
    return {
      success: false,
      code: "CANCELLATION_FAILED",
      message: error?.message || "Failed to cancel registration. Please try again.",
    };
  }
}
