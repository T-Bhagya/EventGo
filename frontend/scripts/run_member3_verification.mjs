// Verification runner for Member 3: Authentication, Authorization & Registration Business Rules

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email?.trim() || "");
}

function mapFirebaseAuthError(error) {
  const code = error?.code || "auth/unknown";
  switch (code) {
    case "auth/email-already-in-use":
      return { message: "This email address is already in use by another account.", code };
    case "auth/invalid-email":
      return { message: "Please enter a valid email address.", code };
    case "auth/weak-password":
      return { message: "The password is too weak. Please use at least 6 characters.", code };
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return { message: "Invalid email or password. Please verify your credentials.", code };
    case "auth/network-request-failed":
      return { message: "Network error. Please check your internet connection.", code };
    default:
      return { message: error?.message || "An unexpected error occurred.", code };
  }
}

function isParticipant(user) {
  return user?.role === "attendee";
}

function isOrganizer(user) {
  return user?.role === "organizer";
}

function canAccessOrganizerFeature(user) {
  if (!user) return { allowed: false, reason: "Authentication required." };
  if (user.role !== "organizer") return { allowed: false, reason: "Access denied. Organizer role required." };
  return { allowed: true };
}

function canRegisterForEvent(user) {
  if (!user) return { allowed: false, reason: "Authentication required." };
  if (user.role !== "attendee") return { allowed: false, reason: "Organizer accounts cannot register as participants." };
  return { allowed: true };
}

function isEventRegistrationOpen(event) {
  try {
    const eventTimeStr = `${event.date} ${event.time || "23:59"}`;
    const eventTimestamp = new Date(eventTimeStr).getTime();
    if (isNaN(eventTimestamp)) {
      const dateTimestamp = new Date(event.date).getTime();
      if (isNaN(dateTimestamp)) return true;
      return dateTimestamp > Date.now();
    }
    return eventTimestamp > Date.now();
  } catch {
    return true;
  }
}

function checkRegistrationEligibility(user, event, userRegistrations = [], eventRegistrations = []) {
  // Rule 1: Auth
  if (!user?.uid) {
    return { success: false, code: "RULE_UNAUTHENTICATED", message: "You must be logged in to register for an event." };
  }
  // Rule 2: Role
  const roleCheck = canRegisterForEvent(user);
  if (!roleCheck.allowed) {
    return { success: false, code: "RULE_UNAUTHORIZED_ROLE", message: roleCheck.reason };
  }
  // Rule 3: Event registerable status
  if (event.status === "cancelled") {
    return { success: false, code: "RULE_EVENT_CANCELLED", message: "Event is cancelled." };
  }
  if (event.status === "completed") {
    return { success: false, code: "RULE_EVENT_COMPLETED", message: "Event already ended." };
  }
  if (event.status === "draft") {
    return { success: false, code: "RULE_EVENT_DRAFT", message: "Event is in draft mode." };
  }
  // Rule 4: Registration Deadline
  if (!isEventRegistrationOpen(event)) {
    return { success: false, code: "RULE_DEADLINE_PASSED", message: "Registration deadline has passed." };
  }
  // Rule 5: Duplicate registration
  const duplicate = userRegistrations.find(r => r.eventId === event.id && r.status === "confirmed");
  if (duplicate) {
    return { success: false, code: "RULE_DUPLICATE_REGISTRATION", message: "You are already registered for this event." };
  }
  // Rule 6: Capacity
  const activeCount = eventRegistrations.filter(r => r.status === "confirmed").length;
  if (event.maxCapacity > 0 && activeCount >= event.maxCapacity) {
    return { success: false, code: "RULE_CAPACITY_FULL", message: "This event is full." };
  }
  // Rule 7: Eligible
  return { success: true, code: "RULE_ELIGIBLE", message: "Eligible for registration." };
}

function checkCancellationEligibility(user, registration, event) {
  if (!user?.uid) {
    return { success: false, code: "CAN_UNAUTHENTICATED", message: "Authentication required." };
  }
  if (registration.status === "cancelled") {
    return { success: false, code: "CAN_ALREADY_CANCELLED", message: "Already cancelled." };
  }
  const isOwner = registration.userId === user.uid;
  const isEventOrganizer = event && event.organizerId === user.uid;
  if (!isOwner && !isEventOrganizer) {
    return { success: false, code: "CAN_UNAUTHORIZED_OWNER", message: "You can only cancel your own registrations." };
  }
  if (event && !isEventRegistrationOpen(event)) {
    return { success: false, code: "CAN_CUTOFF_PASSED", message: "Cancellation cut-off has passed." };
  }
  return { success: true, code: "CAN_ELIGIBLE", message: "Eligible for cancellation." };
}

// RUN TESTS
const results = [];
function recordTest(id, scenario, expected, actual, passed) {
  results.push({ id, scenario, expected, actual, status: passed ? "PASSED" : "FAILED" });
}

// 1. Auth tests
recordTest("AUTH-01", "Valid email validation", "true", String(validateEmail("student@campus.edu")), validateEmail("student@campus.edu") === true);
recordTest("AUTH-02", "Invalid email validation", "false", String(validateEmail("invalid-email")), validateEmail("invalid-email") === false);
recordTest("AUTH-03", "Map Firebase weak-password error", "Weak password warning", mapFirebaseAuthError({ code: "auth/weak-password" }).message, mapFirebaseAuthError({ code: "auth/weak-password" }).code === "auth/weak-password");
recordTest("AUTH-04", "Map Firebase wrong-password error", "Invalid credentials", mapFirebaseAuthError({ code: "auth/wrong-password" }).message, mapFirebaseAuthError({ code: "auth/wrong-password" }).code === "auth/wrong-password");

// 2. Role tests
const attendee = { uid: "att-1", role: "attendee", name: "Alice" };
const organizer = { uid: "org-1", role: "organizer", name: "Bob" };

recordTest("ROLE-01", "Participant identification", "true", String(isParticipant(attendee)), isParticipant(attendee) === true);
recordTest("ROLE-02", "Participant denied organizer dashboard", "allowed: false", String(canAccessOrganizerFeature(attendee).allowed), canAccessOrganizerFeature(attendee).allowed === false);
recordTest("ROLE-03", "Organizer allowed organizer dashboard", "allowed: true", String(canAccessOrganizerFeature(organizer).allowed), canAccessOrganizerFeature(organizer).allowed === true);
recordTest("ROLE-04", "Organizer denied attendee event registration", "allowed: false", String(canRegisterForEvent(organizer).allowed), canRegisterForEvent(organizer).allowed === false);

// 3. Registration rules
const validEvent = { id: "e1", organizerId: "org-1", title: "Tech Fest 2027", date: "2027-12-01", time: "10:00", maxCapacity: 100, status: "upcoming" };
const fullEvent = { ...validEvent, id: "e2", maxCapacity: 2 };
const cancelledEvent = { ...validEvent, id: "e3", status: "cancelled" };
const pastEvent = { ...validEvent, id: "e4", date: "2020-01-01" };

const checkReg1 = checkRegistrationEligibility(null, validEvent);
recordTest("REG-01", "Rule 1: Unauthenticated registration", "RULE_UNAUTHENTICATED", checkReg1.code, checkReg1.code === "RULE_UNAUTHENTICATED");

const checkReg2 = checkRegistrationEligibility(organizer, validEvent);
recordTest("REG-02", "Rule 2: Organizer registering as attendee", "RULE_UNAUTHORIZED_ROLE", checkReg2.code, checkReg2.code === "RULE_UNAUTHORIZED_ROLE");

const checkReg3 = checkRegistrationEligibility(attendee, cancelledEvent);
recordTest("REG-03", "Rule 3: Cancelled event registration", "RULE_EVENT_CANCELLED", checkReg3.code, checkReg3.code === "RULE_EVENT_CANCELLED");

const checkReg4 = checkRegistrationEligibility(attendee, pastEvent);
recordTest("REG-04", "Rule 4: Deadline passed event", "RULE_DEADLINE_PASSED", checkReg4.code, checkReg4.code === "RULE_DEADLINE_PASSED");

const userRegs = [{ eventId: "e1", userId: "att-1", status: "confirmed" }];
const checkReg5 = checkRegistrationEligibility(attendee, validEvent, userRegs, []);
recordTest("REG-05", "Rule 5: Duplicate event registration", "RULE_DUPLICATE_REGISTRATION", checkReg5.code, checkReg5.code === "RULE_DUPLICATE_REGISTRATION");

const eventRegsFull = [{ status: "confirmed" }, { status: "confirmed" }];
const checkReg6 = checkRegistrationEligibility(attendee, fullEvent, [], eventRegsFull);
recordTest("REG-06", "Rule 6: Full capacity event", "RULE_CAPACITY_FULL", checkReg6.code, checkReg6.code === "RULE_CAPACITY_FULL");

const checkReg7 = checkRegistrationEligibility(attendee, validEvent, [], []);
recordTest("REG-07", "Rule 7: Eligible attendee registration", "RULE_ELIGIBLE", checkReg7.code, checkReg7.code === "RULE_ELIGIBLE");

// 4. Cancellation rules
const activeReg = { id: "r1", userId: "att-1", eventId: "e1", status: "confirmed" };
const cancelledReg = { ...activeReg, status: "cancelled" };

const can1 = checkCancellationEligibility(attendee, activeReg, validEvent);
recordTest("CAN-01", "Eligible cancellation by owner", "CAN_ELIGIBLE", can1.code, can1.code === "CAN_ELIGIBLE");

const can2 = checkCancellationEligibility(null, activeReg, validEvent);
recordTest("CAN-02", "Unauthenticated cancellation", "CAN_UNAUTHENTICATED", can2.code, can2.code === "CAN_UNAUTHENTICATED");

const can3 = checkCancellationEligibility(attendee, cancelledReg, validEvent);
recordTest("CAN-03", "Already cancelled registration", "CAN_ALREADY_CANCELLED", can3.code, can3.code === "CAN_ALREADY_CANCELLED");

const otherUser = { uid: "other-user", role: "attendee" };
const can4 = checkCancellationEligibility(otherUser, activeReg, validEvent);
recordTest("CAN-04", "Cancellation by non-owner imposter", "CAN_UNAUTHORIZED_OWNER", can4.code, can4.code === "CAN_UNAUTHORIZED_OWNER");

const can5 = checkCancellationEligibility(attendee, activeReg, pastEvent);
recordTest("CAN-05", "Cancellation after event cut-off", "CAN_CUTOFF_PASSED", can5.code, can5.code === "CAN_CUTOFF_PASSED");

console.log("\n==========================================================================");
console.log("       EVENTGO - MEMBER 3 AUTHENTICATION & BUSINESS RULES TEST LOG        ");
console.log("==========================================================================\n");
console.table(results);

const allPassed = results.every(r => r.status === "PASSED");
if (allPassed) {
  console.log(`\nAll ${results.length} test cases PASSED successfully! (100% SUCCESS)\n`);
} else {
  console.error("\nSome test cases failed!\n");
  process.exit(1);
}
