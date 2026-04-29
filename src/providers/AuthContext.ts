import { createContext } from "react";
import type { LoginInput } from "@/schemas/loginSchema";
import type { AuthUser } from "@/types/auth";

export type AuthContextValue = {
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  user: AuthUser | null;
  signIn: (input: LoginInput) => Promise<void>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
