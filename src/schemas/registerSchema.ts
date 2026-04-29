import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Informe pelo menos 2 caracteres."),
    lastName: z.string().trim().min(2, "Informe pelo menos 2 caracteres."),
    username: z.string().trim().min(3, "Informe pelo menos 3 caracteres."),
    email: z.string().trim().email("Informe um e-mail valido."),
    age: z.coerce
      .number({ invalid_type_error: "Informe uma idade valida." })
      .int("Informe uma idade inteira.")
      .min(13, "A idade minima e 13 anos."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas nao conferem.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
