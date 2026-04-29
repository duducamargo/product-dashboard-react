import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AuthIcon } from "@/components/auth/AuthIcon";
import { registerSchema, type RegisterInput } from "@/schemas/registerSchema";
import type { CreatedUser } from "@/types/user";
import "@/components/auth/AuthForm.css";

type RegisterFormProps = {
  onSubmit: (input: RegisterInput) => Promise<CreatedUser>;
};

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      age: 18,
      password: "",
      confirmPassword: "",
    },
  });

  async function submit(input: RegisterInput) {
    setCreatedUser(null);

    try {
      const user = await onSubmit(input);
      setCreatedUser(user);
      reset();
    } catch {
      setError("root", {
        message: "Nao foi possivel criar a conta. Tente novamente.",
      });
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="auth-field-row">
        <label className="auth-field">
          <span>Nome</span>
          <div className="input-control">
            <AuthIcon name="user" size={18} />
            <input type="text" autoComplete="given-name" placeholder="Maria" {...register("firstName")} />
          </div>
          {errors.firstName ? <small>{errors.firstName.message}</small> : null}
        </label>

        <label className="auth-field">
          <span>Sobrenome</span>
          <div className="input-control">
            <AuthIcon name="user" size={18} />
            <input type="text" autoComplete="family-name" placeholder="Silva" {...register("lastName")} />
          </div>
          {errors.lastName ? <small>{errors.lastName.message}</small> : null}
        </label>
      </div>

      <label className="auth-field">
        <span>Usuario</span>
        <div className="input-control">
          <AuthIcon name="user" size={18} />
          <input type="text" autoComplete="username" placeholder="maria.silva" {...register("username")} />
        </div>
        {errors.username ? <small>{errors.username.message}</small> : null}
      </label>

      <label className="auth-field">
        <span>E-mail</span>
        <div className="input-control">
          <AuthIcon name="mail" size={18} />
          <input type="email" autoComplete="email" placeholder="maria@techstore.com" {...register("email")} />
        </div>
        {errors.email ? <small>{errors.email.message}</small> : null}
      </label>

      <label className="auth-field">
        <span>Idade</span>
        <div className="input-control">
          <AuthIcon name="user" size={18} />
          <input type="number" min="13" inputMode="numeric" placeholder="18" {...register("age")} />
        </div>
        {errors.age ? <small>{errors.age.message}</small> : null}
      </label>

      <label className="auth-field">
        <span>Senha</span>
        <div className="input-control">
          <AuthIcon name="lock" size={18} />
          <input type="password" autoComplete="new-password" placeholder="********" {...register("password")} />
        </div>
        {errors.password ? <small>{errors.password.message}</small> : null}
      </label>

      <label className="auth-field">
        <span>Confirmar senha</span>
        <div className="input-control">
          <AuthIcon name="lock" size={18} />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="********"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword ? <small>{errors.confirmPassword.message}</small> : null}
      </label>

      {errors.root ? <p className="form-error">{errors.root.message}</p> : null}
      {createdUser ? (
        <p className="form-success">
          Conta simulada criada para {createdUser.firstName} com id {createdUser.id}.
        </p>
      ) : null}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        <span>{isSubmitting ? "Criando conta..." : "Criar conta"}</span>
        <AuthIcon name="login" size={17} />
      </button>
    </form>
  );
}
