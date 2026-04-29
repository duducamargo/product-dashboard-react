import { Navigate, useNavigate } from "react-router-dom";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterInput } from "@/schemas/registerSchema";

export function RegisterPage() {
  const { isAuthenticated, signUp } = useAuth();
  const navigate = useNavigate();

  async function handleRegister(input: RegisterInput) {
    await signUp(input);
    navigate("/home", { replace: true });
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <AuthPageLayout
      title="Crie sua conta"
      description="Cadastre um usuario para acessar a aplicacao com token local."
      prompt="Ja tem uma conta?"
      promptActionLabel="Entrar"
      promptActionTo="/"
    >
      <RegisterForm onSubmit={handleRegister} />
    </AuthPageLayout>
  );
}
