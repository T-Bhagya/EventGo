import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "firebase/auth";

import * as authService from "../services/authService";
import {
  AuthResult,
  AuthSessionStatus,
  LoginCredentials,
  RegisterCredentials,
} from "../types/auth.types";
import { UserProfile, UserRole } from "../types/user.types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  status: AuthSessionStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  isParticipant: boolean;
  isOrganizer: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult<UserProfile>>;
  register: (credentials: RegisterCredentials) => Promise<AuthResult<UserProfile>>;
  logout: () => Promise<AuthResult<void>>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthSessionStatus>("loading");

  const refreshProfile = useCallback(async () => {
    try {
      const p = await authService.getCurrentUserProfile();
      setProfile(p);
    } catch (e) {
      console.error("[AuthProvider] Error refreshing profile:", e);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthState(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userProfile = await authService.getCurrentUserProfile();
          setProfile(userProfile);
          setStatus("authenticated");
        } catch {
          setStatus("authenticated");
        }
      } else {
        setProfile(null);
        setStatus("unauthenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResult<UserProfile>> => {
    const result = await authService.login(credentials);
    if (result.success && result.data) {
      setProfile(result.data);
      setStatus("authenticated");
    }
    return result;
  };

  const register = async (
    credentials: RegisterCredentials
  ): Promise<AuthResult<UserProfile>> => {
    const result = await authService.register(credentials);
    if (result.success && result.data) {
      setProfile(result.data);
      setStatus("authenticated");
    }
    return result;
  };

  const logout = async (): Promise<AuthResult<void>> => {
    const result = await authService.logout();
    if (result.success) {
      setUser(null);
      setProfile(null);
      setStatus("unauthenticated");
    }
    return result;
  };

  const role = profile?.role ?? null;
  const isParticipant = role === "attendee";
  const isOrganizer = role === "organizer";
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        status,
        isLoading,
        isAuthenticated,
        isParticipant,
        isOrganizer,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
