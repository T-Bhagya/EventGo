import {
  canAccessOrganizerFeature,
  canAccessParticipantFeature,
  canManageEvent,
  canRegisterForEvent,
  isOrganizer,
  isParticipant,
} from "../services/authGuardService";
import { mapFirebaseAuthError, validateEmail } from "../services/authService";
import {
  checkCancellationEligibility,
  checkRegistrationEligibility,
} from "../services/eventRegistrationBusinessService";
import { EventItem } from "../types/event.types";
import { Registration } from "../types/registration.types";
import { UserProfile } from "../types/user.types";

describe("Member 3: Authentication, Authorization & Core Business Logic Tests", () => {
  // Test Data
  const attendeeUser: UserProfile = {
    uid: "user-att-001",
    name: "Kasun Perera",
    email: "kasun@example.com",
    role: "attendee",
  };

  const organizerUser: UserProfile = {
    uid: "user-org-002",
    name: "Dr. Nimal",
    email: "nimal@example.com",
    role: "organizer",
  };

  const futureEvent: EventItem = {
    id: "evt-001",
    organizerId: "user-org-002",
    organizer: "Dr. Nimal",
    title: "AI & Robotics Summit 2027",
    category: "Tech",
    date: "2027-11-20",
    time: "10:00 AM",
    location: "Main Auditorium",
    price: "Free",
    imageUrl: "https://example.com/event.jpg",
    description: "Annual Tech Conference",
    attendeesCount: 5,
    maxCapacity: 50,
    status: "upcoming",
  };

  const fullEvent: EventItem = {
    ...futureEvent,
    id: "evt-002",
    title: "Sold Out Hackathon",
    maxCapacity: 10,
  };

  const cancelledEvent: EventItem = {
    ...futureEvent,
    id: "evt-003",
    status: "cancelled",
  };

  const pastEvent: EventItem = {
    ...futureEvent,
    id: "evt-004",
    date: "2020-01-01",
  };

  /* -------------------------------------------------------------
   * 1. Authentication & Validation Tests
   * ----------------------------------------------------------- */
  describe("Authentication Input Validation & Error Mapping", () => {
    test("AUTH-01: Valid email formats pass validation", () => {
      expect(validateEmail("user@university.edu")).toBe(true);
      expect(validateEmail("test.user+tag@gmail.com")).toBe(true);
    });

    test("AUTH-02: Invalid email formats fail validation", () => {
      expect(validateEmail("plainaddress")).toBe(false);
      expect(validateEmail("missing@domain")).toBe(false);
      expect(validateEmail("@nodomain.com")).toBe(false);
      expect(validateEmail("")).toBe(false);
    });

    test("AUTH-03: Firebase auth errors map to clean user-friendly messages", () => {
      const errEmailInUse = mapFirebaseAuthError({
        code: "auth/email-already-in-use",
      });
      expect(errEmailInUse.message).toContain("already in use");

      const errWrongPass = mapFirebaseAuthError({
        code: "auth/wrong-password",
      });
      expect(errWrongPass.message).toContain("Invalid email or password");

      const errNetwork = mapFirebaseAuthError({
        code: "auth/network-request-failed",
      });
      expect(errNetwork.message).toContain("Network error");
    });
  });

  /* -------------------------------------------------------------
   * 2. Role-Based Authorization Tests
   * ----------------------------------------------------------- */
  describe("Role-Based Authorization", () => {
    test("ROLE-01: Attendee is correctly identified and permitted attendee access", () => {
      expect(isParticipant(attendeeUser)).toBe(true);
      expect(isOrganizer(attendeeUser)).toBe(false);
      expect(canAccessParticipantFeature(attendeeUser).allowed).toBe(true);
      expect(canRegisterForEvent(attendeeUser).allowed).toBe(true);
    });

    test("ROLE-02: Attendee is blocked from organizer-restricted features", () => {
      const check = canAccessOrganizerFeature(attendeeUser);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("registered event organizers");
    });

    test("ROLE-03: Organizer is recognized and allowed organizer features", () => {
      expect(isOrganizer(organizerUser)).toBe(true);
      expect(isParticipant(organizerUser)).toBe(false);
      expect(canAccessOrganizerFeature(organizerUser).allowed).toBe(true);
    });

    test("ROLE-04: Organizer is blocked from registering as an event attendee", () => {
      const check = canRegisterForEvent(organizerUser);
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain("Organizer accounts cannot register");
    });

    test("ROLE-05: Organizer can only manage their own events", () => {
      expect(canManageEvent(organizerUser, futureEvent).allowed).toBe(true);

      const otherOrganizerUser: UserProfile = {
        uid: "user-org-999",
        name: "Other Org",
        email: "other@org.com",
        role: "organizer",
      };
      const checkOther = canManageEvent(otherOrganizerUser, futureEvent);
      expect(checkOther.allowed).toBe(false);
      expect(checkOther.reason).toContain("only manage events you created");
    });
  });

  /* -------------------------------------------------------------
   * 3. Event Registration Business Rules (Step 7)
   * ----------------------------------------------------------- */
  describe("Event Registration Business Rules (7 Rules)", () => {
    test("REG-01: Rule 1 — Rejects unauthenticated user", async () => {
      const result = await checkRegistrationEligibility(null, futureEvent);
      expect(result.success).toBe(false);
      expect(result.code).toBe("RULE_UNAUTHENTICATED");
    });

    test("REG-02: Rule 2 — Rejects organizer role from registering", async () => {
      const result = await checkRegistrationEligibility(
        organizerUser,
        futureEvent
      );
      expect(result.success).toBe(false);
      expect(result.code).toBe("RULE_UNAUTHORIZED_ROLE");
    });

    test("REG-03: Rule 3 — Rejects cancelled or non-active events", async () => {
      const result = await checkRegistrationEligibility(
        attendeeUser,
        cancelledEvent
      );
      expect(result.success).toBe(false);
      expect(result.code).toBe("RULE_EVENT_CANCELLED");
    });

    test("REG-04: Rule 4 — Rejects registration after event deadline has passed", async () => {
      const result = await checkRegistrationEligibility(
        attendeeUser,
        pastEvent
      );
      expect(result.success).toBe(false);
      expect(result.code).toBe("RULE_DEADLINE_PASSED");
    });

    test("REG-05: Rule 7 — Allows eligible attendee for valid upcoming event", async () => {
      const result = await checkRegistrationEligibility(
        attendeeUser,
        futureEvent
      );
      expect(result.success).toBe(true);
      expect(result.code).toBe("RULE_ELIGIBLE");
    });
  });

  /* -------------------------------------------------------------
   * 4. Cancellation Business Rules (Step 8)
   * ----------------------------------------------------------- */
  describe("Registration Cancellation Business Rules", () => {
    const activeReg: Registration = {
      id: "reg-101",
      userId: attendeeUser.uid,
      eventId: futureEvent.id,
      status: "confirmed",
      registeredAt: new Date().toISOString(),
    };

    const cancelledReg: Registration = {
      ...activeReg,
      id: "reg-102",
      status: "cancelled",
    };

    test("CAN-01: Allows eligible attendee to cancel active registration", () => {
      const result = checkCancellationEligibility(
        attendeeUser,
        activeReg,
        futureEvent
      );
      expect(result.success).toBe(true);
      expect(result.code).toBe("CAN_ELIGIBLE");
    });

    test("CAN-02: Rejects cancellation if user is unauthenticated", () => {
      const result = checkCancellationEligibility(null, activeReg, futureEvent);
      expect(result.success).toBe(false);
      expect(result.code).toBe("CAN_UNAUTHENTICATED");
    });

    test("CAN-03: Rejects already cancelled registration", () => {
      const result = checkCancellationEligibility(
        attendeeUser,
        cancelledReg,
        futureEvent
      );
      expect(result.success).toBe(false);
      expect(result.code).toBe("CAN_ALREADY_CANCELLED");
    });

    test("CAN-04: Rejects unauthorized user attempting to cancel another's registration", () => {
      const anotherUser: UserProfile = {
        uid: "user-random-777",
        name: "Imposter",
        email: "imposter@test.com",
        role: "attendee",
      };
      const result = checkCancellationEligibility(
        anotherUser,
        activeReg,
        futureEvent
      );
      expect(result.success).toBe(false);
      expect(result.code).toBe("CAN_UNAUTHORIZED_OWNER");
    });

    test("CAN-05: Rejects cancellation if event cut-off has passed", () => {
      const result = checkCancellationEligibility(
        attendeeUser,
        activeReg,
        pastEvent
      );
      expect(result.success).toBe(false);
      expect(result.code).toBe("CAN_CUTOFF_PASSED");
    });
  });
});
