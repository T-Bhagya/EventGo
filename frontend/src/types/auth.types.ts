import { UserProfile, UserRole } from "./user.types";

export type AuthSessionStatus = "loading" | "authenticated" | "unauthenticated";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
  university?: string;
}

export interface AuthResult<T = UserProfile> {
  success: boolean;
  data?: T;
  message: string;
  errorCode?: string;
}

export interface BusinessRuleResult<T = void> {
  success: boolean;
  message: string;
  code?: string;
  data?: T;
}

export interface AuthState {
  user: UserProfile | null;
  status: AuthSessionStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAttendee: boolean;
  isOrganizer: boolean;
}
