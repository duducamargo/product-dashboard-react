import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginInput } from "@/schemas/loginSchema";

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

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

  async function onSubmit(input: LoginInput) {
    try {
      await signIn(input);
      navigate(redirectTo, { replace: true });
    } catch {
      setError("root", {
        message: "Usuario ou senha invalidos.",
      });
    }
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-heading">
          <p className="eyebrow">Product Dashboard</p>
          <h1 id="login-title">Acesse sua conta</h1>
          <p>Use as credenciais da DummyJSON para iniciar a sessao.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="field">
            <span>Usuario</span>
            <input
              type="text"
              autoComplete="username"
              placeholder="ex: emilys"
              {...register("username")}
            />
            {errors.username ? <small>{errors.username.message}</small> : null}
          </label>

          <label className="field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="ex: emilyspass"
              {...register("password")}
            />
            {errors.password ? <small>{errors.password.message}</small> : null}
          </label>

          {errors.root ? <p className="form-error">{errors.root.message}</p> : null}

          <button className="button-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
