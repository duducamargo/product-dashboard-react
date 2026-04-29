import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthIcon } from "@/components/auth/AuthIcon";
import { loginSchema, type LoginInput } from "@/schemas/loginSchema";

type LoginFormProps = {
  onSubmit: (input: LoginInput) => Promise<void>;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
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

  async function submit(input: LoginInput) {
    try {
      await onSubmit(input);
    } catch {
      setError("root", {
        message: "Usuario ou senha invalidos.",
      });
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(submit)} noValidate>
      <label className="login-field">
        <span>Usuario</span>
        <div className="input-control">
          <AuthIcon name="user" size={18} />
          <input
            type="text"
            autoComplete="username"
            placeholder="johndoe_92"
            {...register("username")}
          />
        </div>
        {errors.username ? <small>{errors.username.message}</small> : null}
      </label>

      <label className="login-field">
        <span>Senha</span>
        <div className="input-control">
          <AuthIcon name="lock" size={18} />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="********"
            {...register("password")}
          />
        </div>
        {errors.password ? <small>{errors.password.message}</small> : null}
      </label>

      {errors.root ? <p className="form-error">{errors.root.message}</p> : null}

      <button className="login-submit" type="submit" disabled={isSubmitting}>
        <span>{isSubmitting ? "Entrando..." : "Entrar"}</span>
        <AuthIcon name="login" size={17} />
      </button>
    </form>
  );
}
