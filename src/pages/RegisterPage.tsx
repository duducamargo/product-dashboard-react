import { Navigate } from "react-router-dom";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterInput } from "@/schemas/registerSchema";
import { usersService } from "@/services/usersService";

export function RegisterPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return (
    <AuthPageLayout
      title="Crie sua conta"
      description="Cadastre um usuario para simular o acesso na DummyJSON."
      prompt="Ja tem uma conta?"
      promptActionLabel="Entrar"
      promptActionTo="/"
    >
      <RegisterForm onSubmit={(input: RegisterInput) => usersService.create(input)} />
    </AuthPageLayout>
  );
}
