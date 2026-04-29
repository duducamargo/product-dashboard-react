import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LoginFeatureList } from "@/components/auth/LoginFeatureList";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppFooter } from "@/components/layout/AppFooter";
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
    <main className="login-page">
      <div className="login-content">
        <header className="login-brand">
          <strong>TechStore</strong>
          <p>A escolha confiavel para hardware profissional.</p>
        </header>

        <section className="login-card" aria-labelledby="login-title">
          <div className="login-heading">
            <h1 id="login-title">Bem-vindo de volta</h1>
            <p>Informe suas credenciais para acessar sua conta.</p>
          </div>

          <LoginForm onSubmit={handleLogin} />

          <div className="login-divider" />

          <p className="signup-prompt">
            Ainda nao tem uma conta?{" "}
            <button className="link-button" type="button">
              Criar conta
            </button>
          </p>
        </section>

        <LoginFeatureList />
      </div>

      <AppFooter />
    </main>
  );
}
