import { useCallback, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextValue } from "@/providers/AuthContext";
import { appPaths } from "@/routes/paths";
import type { LoginInput } from "@/schemas/loginSchema";
import { authService } from "@/services/authService";
import type { AuthSession } from "@/types/auth";
import { authStorage } from "@/utils/authStorage";

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(() => authStorage.get());
  const [isSessionLoading, setIsSessionLoading] = useState(false);

  useEffect(() => {
    authStorage.set(session);
  }, [session]);

  const signIn = useCallback(
    async (input: LoginInput) => {
      const nextSession = await authService.login(input);
      setSession(nextSession);
    },
    []
  );

  const signOut = useCallback(() => {
    setSession(null);
    navigate(appPaths.login, { replace: true });
  }, [navigate]);

  const refreshSession = useCallback(async () => {
    if (!session?.refreshToken) {
      return;
    }

    setIsSessionLoading(true);

    try {
      const nextSession = await authService.refresh(session.refreshToken, session.user);
      setSession(nextSession);
    } catch {
      setSession(null);
      navigate(appPaths.login, { replace: true });
    } finally {
      setIsSessionLoading(false);
    }
  }, [navigate, session?.refreshToken, session?.user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(session?.accessToken),
      isSessionLoading,
      user: session?.user ?? null,
      signIn,
      signOut,
      refreshSession,
    }),
    [isSessionLoading, refreshSession, session?.accessToken, session?.user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
