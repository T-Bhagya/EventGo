import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "../config/firebase";
import * as userRepository from "../repositories/UserRepository";
import {
  AuthResult,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.types";
import { UserProfile, UserRole } from "../types/user.types";

/**
 * Maps raw Firebase authentication error codes to clean, human-readable messages.
 */
export function mapFirebaseAuthError(error: any): {
  message: string;
  code: string;
} {
  const code = error?.code || "auth/unknown";

  switch (code) {
    case "auth/email-already-in-use":
      return {
        message: "This email address is already in use by another account.",
        code,
      };
    case "auth/invalid-email":
      return { message: "Please enter a valid email address.", code };
    case "auth/operation-not-allowed":
      return {
        message: "Email/password authentication is not enabled for this project.",
        code,
      };
    case "auth/weak-password":
      return {
        message: "The password is too weak. Please use at least 6 characters.",
        code,
      };
    case "auth/user-disabled":
      return {
        message: "This account has been disabled. Please contact support.",
        code,
      };
    case "auth/user-not-found":
      return {
        message: "No user found with this email address.",
        code,
      };
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return {
        message: "Invalid email or password. Please verify your credentials.",
        code,
      };
    case "auth/too-many-requests":
      return {
        message: "Access blocked due to unusual activity. Try again later.",
        code,
      };
    case "auth/network-request-failed":
      return {
        message: "Network error. Please check your internet connection.",
        code,
      };
    default:
      return {
        message: error?.message || "An unexpected authentication error occurred.",
        code,
      };
  }
}

/**
 * Validates email format.
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

/**
 * Registers a new user with Firebase Auth and creates their UserProfile in Firestore.
 */
export async function register(
  credentials: RegisterCredentials
): Promise<AuthResult<UserProfile>> {
  const { email, password, fullName, role = "attendee" } = credentials;

  // Validation
  if (!fullName || !fullName.trim()) {
    return {
      success: false,
      message: "Please enter your full name.",
      errorCode: "validation/missing-name",
    };
  }

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errorCode: "validation/invalid-email",
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters long.",
      errorCode: "validation/weak-password",
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const uid = userCredential.user.uid;

    const newProfile: UserProfile = {
      uid,
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      role,
      interests: [],
      isVerified: false,
    };

    // Store extended profile in Firestore via UserRepository
    await userRepository.createUserProfile(newProfile);

    return {
      success: true,
      message: "Registration successful.",
      data: newProfile,
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      message: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * Authenticates a user with email and password, then fetches their profile.
 */
export async function login(
  credentials: LoginCredentials
): Promise<AuthResult<UserProfile>> {
  const { email, password } = credentials;

  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errorCode: "validation/invalid-email",
    };
  }

  if (!password || !password.trim()) {
    return {
      success: false,
      message: "Please enter your password.",
      errorCode: "validation/missing-password",
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const uid = userCredential.user.uid;
    let profile = await userRepository.getUserProfile(uid);

    // Fallback profile if Firestore document does not exist yet
    if (!profile) {
      profile = {
        uid,
        name: userCredential.user.displayName || email.split("@")[0],
        email: userCredential.user.email || email.trim(),
        role: "attendee",
      };
      await userRepository.createUserProfile(profile);
    }

    return {
      success: true,
      message: "Login successful.",
      data: profile,
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      message: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * Signs the current user out of Firebase Auth.
 */
export async function logout(): Promise<AuthResult<void>> {
  try {
    await signOut(auth);
    return {
      success: true,
      message: "Logged out successfully.",
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      message: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * Sends a password reset email.
 */
export async function sendPasswordReset(
  email: string
): Promise<AuthResult<void>> {
  if (!email || !validateEmail(email)) {
    return {
      success: false,
      message: "Please enter a valid email address.",
      errorCode: "validation/invalid-email",
    };
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
    return {
      success: true,
      message: "Password reset link sent to your email.",
    };
  } catch (error: any) {
    const mapped = mapFirebaseAuthError(error);
    return {
      success: false,
      message: mapped.message,
      errorCode: mapped.code,
    };
  }
}

/**
 * Returns the currently authenticated raw Firebase User.
 */
export function getCurrentFirebaseUser(): User | null {
  return auth.currentUser;
}

/**
 * Retrieves the full profile of the currently authenticated user.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const current = auth.currentUser;
  if (!current) return null;
  return userRepository.getUserProfile(current.uid);
}

/**
 * Subscribes to Firebase Auth session changes.
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}
