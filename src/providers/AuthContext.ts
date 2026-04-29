import { createContext } from "react";
import type { LoginInput } from "@/schemas/loginSchema";
import type { RegisterInput } from "@/schemas/registerSchema";
import type { AuthUser } from "@/types/auth";

export type AuthContextValue = {
  isAuthenticated: boolean;
  isSessionLoading: boolean;
  user: AuthUser | null;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: RegisterInput) => Promise<void>;
  signOut: () => void;
  refreshSession: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
