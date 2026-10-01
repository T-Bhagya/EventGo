# EventGo — Member 3 Antigravity Implementation Plan
## Authentication & Core Business Logic Owner

> **Role:** Member 3  
> **Primary responsibility:** Firebase Authentication, session handling, role-based authorization, registration/cancellation business rules, and reusable validation logic.  
> **Important:** Work only in the assigned Member 3 branch. Do not overwrite Member 1 UI work or Member 2 database/repository work.

---

# 1. Goal

Implement the **Authentication & Core Business Logic** module for EventGo so that:

- Users can register, log in, log out, and maintain an authenticated session.
- The system supports **Participant** and **Organizer** roles.
- Participants cannot access Organizer-only actions.
- Event registration follows all required business rules.
- Duplicate event registration is prevented.
- Registration is blocked when an event is full.
- Registration is blocked after the registration deadline.
- Registration is blocked for cancelled/inactive events.
- Eligible registrations can be cancelled according to the defined rules.
- UI screens can call clean reusable functions instead of containing business logic.
- Member 2's repository/data layer is used for Firestore reads/writes when available.

---

# 2. Project Rules — Read Before Coding

Antigravity must follow these rules:

1. **Inspect the repository before changing anything.**
2. Determine the real project framework, folder structure, Firebase setup, packages, models, repositories, and current branches.
3. Do **not** recreate existing files unless necessary.
4. Do **not** rename or silently change shared models/interfaces created by Member 2.
5. Do **not** redesign Member 1's UI.
6. Keep authentication/business logic outside UI screens.
7. Reuse existing services, repositories, types/models, and Firebase configuration.
8. If Member 2's repository methods are incomplete, create clean temporary interfaces/adapters or TODO integration points rather than duplicating the database layer.
9. Keep changes modular and easy to merge.
10. Run available checks/tests after each major phase.
11. Before destructive changes, stop and explain what would be changed.
12. Never commit Firebase secrets, `.env` values, service-account files, or private credentials.
13. Keep clear Git commits for Member 3's individual contribution.

---

# 3. Expected Architecture

Use the project's intended separation:

```text
UI / Screens
    ↓
ViewModel / State / Controller
    ↓
Member 3 Auth & Business Logic Services
    ↓
Member 2 Repository / Data Layer
    ↓
Firebase Authentication / Firestore
```

Business rules must **not** be duplicated across different screens.

---

# 4. Shared Data Expected

Before implementing registration rules, inspect Member 2's actual models.

Expected concepts are:

## User

```text
id
name
email
role
university
interests
```

Expected roles:

```text
participant
organizer
```

## Event

```text
id
organizerId
title
description
category
date
venue
lat
lng
capacity
deadline
status
```

## Registration

```text
id
userId
eventId
status
registeredAt
```

Do not force these exact field names if Member 2 already uses different names. Adapt Member 3 logic to the existing shared model.

---

# 5. Step 0 — Repository Inspection

Before coding, Antigravity must inspect:

- project framework and language
- package/dependency file
- Firebase configuration
- auth-related packages
- state-management approach
- routing/navigation approach
- `src`, `lib`, `services`, `repositories`, `models`, `types`, `controllers`, `viewmodels`, or equivalent folders
- Member 2 repository methods
- existing User/Event/Registration models
- current authentication code
- environment configuration
- existing tests
- current Git status and branch

Then give a short report:

```text
Framework:
Current branch:
Firebase configured: Yes/No
Auth package available: Yes/No
User model:
Event model:
Registration model:
Repositories found:
Existing auth code:
State management:
Files Member 3 should add/change:
Dependencies/blockers:
```

### STOP CONDITION

If shared models are unclear or incompatible, do not guess.

Explain exactly what is missing and propose the smallest interface required from Member 2.

Otherwise continue.

---

# 6. Step 1 — Git Safety

Verify that the work is not being done directly on `main`.

If necessary, create or switch to a Member 3 branch such as:

```bash
git checkout -b authentication-business-logic
```

If the team already specified another Member 3 branch, use that instead.

Run:

```bash
git status
git branch
git log --oneline -5
```

Do not discard teammates' uncommitted work.

---

# 7. Step 2 — Verify Firebase Authentication Setup

Check whether Firebase is already initialized.

Reuse the existing project Firebase configuration.

Do not initialize a second Firebase app unless the project architecture requires it.

Confirm authentication support for:

- email/password registration
- email/password login
- logout/sign out
- authentication state/session listener

If a required package is missing, install only the minimum required dependency using the project's package manager.

After installation, run the project's dependency/build/type check.

---

# 8. Step 3 — Create Authentication Service

Create or update a dedicated authentication service.

Use the naming convention already present in the repository.

Example conceptual structure:

```text
auth_service
    register(...)
    login(...)
    logout(...)
    getCurrentUser()
    authStateChanges / sessionListener
```

The service must:

- accept validated inputs
- call Firebase Authentication
- convert Firebase errors into clean application errors
- avoid UI/navigation code
- expose predictable results to screens/state layer

## Required Operations

### Register

Inputs should include at least:

```text
email
password
```

and any profile fields required by the existing application.

Flow:

```text
Validate input
→ Create Firebase Auth account
→ Obtain Firebase UID
→ Pass extended profile to Member 2 user repository
→ Return success/user
```

Do not directly duplicate Member 2's Firestore user-writing logic if a repository already exists.

### Login

Flow:

```text
Validate email/password
→ Firebase sign-in
→ Load extended user profile/role
→ Return authenticated user/session
```

### Logout

Flow:

```text
Firebase sign-out
→ clear relevant local session state if required
→ return result
```

### Session Handling

Expose a way for the app to determine:

```text
loading
authenticated
unauthenticated
```

and, once known:

```text
participant
organizer
```

---

# 9. Step 4 — Authentication Error Handling

Create reusable mappings for common authentication failures.

Examples:

```text
invalid email
weak password
email already in use
wrong credentials
user not found
network unavailable
permission denied
unknown authentication error
```

Do not expose raw Firebase exception text directly to users when a cleaner message can be returned.

Return a consistent result shape appropriate for the project's architecture.

Example concept:

```text
success: true/false
data/user: optional
message: human-readable message
errorCode: optional
```

Use the project's existing result/error type if one exists.

---

# 10. Step 5 — Role-Based Authorization

Implement role logic for:

```text
Participant
Organizer
```

Required behavior:

### Participant

Can access participant features such as:

- browse events
- view event details
- register for events
- cancel eligible registrations
- My Events
- attendance flow when eligible
- feedback when eligible

### Organizer

Can access organizer actions such as:

- create event
- edit owned event
- cancel/manage owned event
- view registrations/participants
- organizer dashboard

At minimum create reusable authorization helpers such as:

```text
isParticipant(...)
isOrganizer(...)
canAccessOrganizerFeature(...)
canManageEvent(...)
```

Adapt names to the existing project style.

Do not rely only on hiding UI buttons.

Authorization must exist in reusable logic.

---

# 11. Step 6 — Registration Business Logic Service

Create a dedicated registration/business-rules service.

Suggested conceptual API:

```text
checkRegistrationEligibility(...)
registerForEvent(...)
checkCancellationEligibility(...)
cancelRegistration(...)
```

Keep business-rule checks centralized.

---

# 12. Step 7 — Registration Eligibility Rules

When a participant attempts to register, validate the following in a safe order.

## Rule 1 — User must be authenticated

If no authenticated user:

```text
DENY
Reason: authentication required
```

## Rule 2 — Correct role / authorization

The registration action is for eligible participants.

If current role is not allowed:

```text
DENY
Reason: unauthorized role
```

## Rule 3 — Event must allow registration

Check the existing event status.

Examples of non-registerable states may include:

```text
cancelled
inactive
closed
```

Use the actual status values defined by Member 2.

If the event is cancelled/inactive:

```text
DENY
Reason: event unavailable for registration
```

## Rule 4 — Registration deadline

Compare the current time against the event's registration deadline.

If deadline has passed:

```text
DENY
Reason: registration deadline has passed
```

Be careful with:

- timestamp conversion
- local time vs stored Firebase timestamp
- null/invalid deadline data

Use the existing project convention.

## Rule 5 — Duplicate registration

Use Member 2's registration repository to determine whether an active registration already exists for:

```text
userId + eventId
```

If yes:

```text
DENY
Reason: already registered
```

Do not solve duplicate prevention only in the UI.

## Rule 6 — Capacity

Determine:

```text
current valid registrations
event capacity
```

If:

```text
current registrations >= capacity
```

then:

```text
DENY
Reason: event is full
```

Validate malformed capacities such as zero or negative values according to the shared model rules.

## Rule 7 — Eligible

If every rule passes:

```text
ALLOW
```

Then call Member 2's repository to create the registration.

---

# 13. Registration Flow

Target behavior:

```text
User taps Register
      ↓
Authenticated?
      ↓
Role allowed?
      ↓
Event registerable?
      ↓
Deadline valid?
      ↓
Already registered?
      ↓
Capacity available?
      ↓
Create registration using repository
      ↓
Return success result
      ↓
Member 1 UI displays result
```

---

# 14. Step 8 — Cancellation Logic

Create reusable cancellation validation.

At minimum check:

```text
user authenticated
registration exists
registration belongs to current user unless organizer/admin rule explicitly permits otherwise
registration is still active
event/cancellation policy permits cancellation
allowed cancellation cut-off has not passed, if such a field/rule exists
```

Important:

The project states that **eligible users can cancel before the allowed cut-off**.

If the existing shared model does not define the exact cancellation cut-off field or policy, do **not invent one**.

Instead:

1. identify the missing policy/model field
2. isolate cancellation validation behind a function
3. implement the known checks
4. leave a clear TODO/blocker for the team to resolve the exact cut-off definition

When cancellation is allowed, use Member 2's repository to update/delete the registration according to the shared repository design.

---

# 15. Step 9 — Clean Status Messages

Create shared messages/results that Member 1 can display.

Examples:

```text
Login successful.
Invalid email or password.
You must log in first.
Organizer access required.
Registration successful.
You are already registered for this event.
This event is full.
Registration deadline has passed.
This event is not accepting registrations.
Registration cancelled successfully.
This registration cannot be cancelled.
Network error. Please try again.
```

Keep UI wording separate enough that it can be changed later without rewriting business rules.

---

# 16. Step 10 — Integrate With Member 2 Repositories

Do not bypass Member 2's database ownership if repository methods exist.

Antigravity should inspect and reuse functions equivalent to:

```text
getUserById
createUserProfile

getEventById
getRegistration
getRegistrationsByEvent
countRegistrations
createRegistration
updateRegistrationStatus
cancelRegistration
```

Names will vary.

If a required repository method is missing:

- do not redesign the database layer
- identify the exact method Member 3 needs
- add a minimal compatible method only if team ownership allows it
- otherwise define the required interface/TODO and continue with mockable logic

---

# 17. Step 11 — Connect to Member 1 UI Safely

Member 1 owns UI.

Do not redesign screens.

Expose simple methods Member 1 can call.

Example:

```text
Login button
→ authService.login(...)

Register account button
→ authService.register(...)

Register for Event button
→ registrationService.registerForEvent(...)

Cancel Registration button
→ registrationService.cancelRegistration(...)
```

Return structured status/results so the UI can show:

```text
loading
success
validation failure
authorization failure
Firebase/network failure
```

If Member 1's UI is not finished yet, create logic that can be integrated later and test it independently.

---

# 18. Step 12 — Route / Feature Authorization

Inspect the current routing solution.

Implement role-aware access using the architecture already used by the project.

Target behavior:

```text
Unauthenticated user
→ Auth/Login flow

Participant
→ Participant/Home flow

Organizer
→ Organizer-capable flow
```

A Participant must not be able to reach Organizer-only operations merely by direct navigation.

Do not hard-code navigation logic inside Firebase service methods.

Keep:

```text
authentication
authorization
navigation
```

separated.

---

# 19. Step 13 — Tests

Test Member 3's module independently before integration.

## Authentication Tests

Test:

```text
valid registration
invalid email
weak password
duplicate email
valid login
invalid credentials
logout
session persists/reloads correctly
```

## Authorization Tests

Test:

```text
Participant allowed participant features
Participant blocked from organizer-only feature
Organizer recognized correctly
Unauthenticated user blocked from protected operation
```

## Registration Rule Tests

Test:

```text
valid registration
duplicate registration
event full
deadline passed
event cancelled/inactive
unauthenticated user
unauthorized role
repository/network failure
```

## Cancellation Tests

Test:

```text
valid cancellation
missing registration
wrong user/owner
already cancelled registration
past cancellation cut-off if supported
```

Use the project's existing test framework if present.

If automated testing is not yet configured, at minimum create a clear manual test log and avoid introducing a completely new heavy testing setup without reason.

---

# 20. Step 14 — Suggested Manual Test Log

Maintain evidence like:

| Test ID | Scenario | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| AUTH-01 | Valid user registration | Account created |  |  |
| AUTH-02 | Invalid email | Rejected with message |  |  |
| AUTH-03 | Valid login | User authenticated |  |  |
| AUTH-04 | Wrong password | Login rejected |  |  |
| AUTH-05 | Logout | Session cleared |  |  |
| ROLE-01 | Participant accesses organizer action | Access denied |  |  |
| REG-01 | Valid event registration | Registration created |  |  |
| REG-02 | Duplicate registration | Registration rejected |  |  |
| REG-03 | Full event | Registration rejected |  |  |
| REG-04 | Passed deadline | Registration rejected |  |  |
| REG-05 | Cancelled event | Registration rejected |  |  |
| REG-06 | Unauthenticated registration | Registration rejected |  |  |
| CAN-01 | Eligible cancellation | Registration cancelled |  |  |
| CAN-02 | Invalid cancellation | Cancellation rejected |  |  |

---

# 21. Step 15 — Evidence for Individual Contribution

Keep evidence for the final demo/report.

Take screenshots or save terminal output showing:

1. Member 3 Git branch.
2. Authentication service code.
3. Role/authorization code.
4. Registration business-rule code.
5. Successful registration/login.
6. Failed login.
7. Duplicate registration rejection.
8. Capacity-full rejection.
9. Deadline rejection.
10. Wrong-role access rejection.
11. Cancellation success/rejection.
12. Test output.
13. Git commits.

Do not expose passwords, API keys, Firebase secrets, or private `.env` values in screenshots.

---

# 22. Step 16 — Code Quality

Before finishing:

- remove unused imports
- remove debug-only code
- remove duplicate validation
- ensure business rules are reusable
- use clear names
- add short comments only where logic is not obvious
- make errors/messages consistent
- ensure no secret files are staged
- run formatter
- run linter/type checker
- run tests
- run/build the application if possible

---

# 23. Step 17 — Git Commit Plan

Keep Member 3 contributions visible with logical commits.

Suggested sequence:

```text
feat: add Firebase authentication service
feat: add session and role authorization logic
feat: add event registration business rules
feat: add registration cancellation validation
test: add authentication and registration rule tests
fix: resolve member 3 integration issues
```

Before each commit:

```bash
git status
git diff
```

Do not stage unrelated files.

---

# 24. Definition of Done

Member 3 work is complete when:

- [ ] Register works.
- [ ] Login works.
- [ ] Logout works.
- [ ] Session/auth state works.
- [ ] Participant and Organizer roles are recognized.
- [ ] Unauthorized role access is rejected.
- [ ] Registration requires authentication.
- [ ] Duplicate registration is rejected.
- [ ] Capacity is validated.
- [ ] Deadline is validated.
- [ ] Cancelled/inactive events reject registration.
- [ ] Eligible registration is created through the data/repository layer.
- [ ] Cancellation validation is implemented.
- [ ] Business logic is not duplicated in UI screens.
- [ ] UI receives clean success/error states.
- [ ] Member 3 tests pass or manual test evidence exists.
- [ ] Code is formatted/linted.
- [ ] No secrets are committed.
- [ ] Member 3 commits clearly show individual contribution.

---

# 25. Viva / Demo Preparation

Member 3 must be able to explain:

## Authentication vs Authorization

```text
Authentication = verifies who the user is.
Authorization = determines what the authenticated user is allowed to do.
```

## Why business rules are outside UI

```text
Business rules should be centralized so every screen uses the same rules,
logic is reusable and testable, and users cannot bypass rules simply through UI changes.
```

## Duplicate Prevention

Explain that registration checks whether an active registration already exists for:

```text
userId + eventId
```

before creating a new registration.

## Capacity Rule

Explain that registration is rejected when the current valid registration count has reached the event capacity.

## Deadline Rule

Explain that current time is compared against the event's registration deadline before allowing registration.

## Role-Based Access

Explain how:

```text
Firebase Authentication
+
stored user profile role
+
authorization helpers/guards
```

control Participant and Organizer actions.

## UI Communication

Explain that business services return structured success/error states and Member 1's UI displays those states.

---

# 26. Important Team Dependencies

## Member 1 — UI / UX

Member 1 does **not** need to finish before Member 3 starts.

Member 3 should expose reusable functions so Member 1 can connect the UI later.

Expected collaboration:

```text
Member 1 Login/Register UI
→ Member 3 authentication service
```

and:

```text
Member 1 Event Details/Register button
→ Member 3 registration rules
```

## Member 2 — Database & Data Layer

Coordinate early with Member 2 about:

```text
User model
Event model
Registration model
Firestore collection names
repository method signatures
event status values
registration status values
timestamp/date representation
```

Member 2 does not need to finish the entire database layer before Member 3 starts.

However, shared model/interface decisions should be stable before final integration.

## Member 5 — Attendance

Member 5 will need registration status to determine whether a user is eligible to check in.

Expose/reuse a reliable registration-status query instead of duplicating registration rules in the attendance module.

---

# 27. Exact Antigravity Working Instructions

Antigravity should execute the task phase by phase.

For every phase:

1. inspect relevant existing files
2. explain what will be changed
3. make only the required changes
4. show changed files
5. run validation/tests
6. report results
7. continue to the next phase

Do not generate the entire module blindly before inspecting the repository.

When an integration dependency is missing, continue with the portions that are independent and clearly mark the blocker.

---

# 28. Start Now

Begin with **Step 0 — Repository Inspection**.

Do not write implementation code yet.

First inspect the project and return:

```text
1. Framework/language
2. Current branch
3. Existing Firebase setup
4. Existing auth code
5. User model
6. Event model
7. Registration model
8. Member 2 repositories
9. State-management/navigation approach
10. Files Member 3 should create/change
11. Any blockers
12. Recommended first implementation step
```

After the inspection is complete, proceed to **Step 1 — Git Safety**, then implement each phase in order.
