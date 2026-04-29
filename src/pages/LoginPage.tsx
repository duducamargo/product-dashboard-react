import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import type { LoginInput } from "@/schemas/loginSchema";

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const redirectTo =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "object" &&
    location.state.from !== null &&
    "pathname" in location.state.from &&
    typeof location.state.from.pathname === "string"
      ? location.state.from.pathname
      : "/home";

  async function handleLogin(input: LoginInput) {
    await signIn(input);
    navigate(redirectTo, { replace: true });
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthPageLayout
      title="Bem-vindo de volta"
      description="Informe suas credenciais para acessar sua conta."
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthPageLayout>
  );
}
