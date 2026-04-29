import { httpClient } from "@/api/httpClient";
import type { RegisterInput } from "@/schemas/registerSchema";
import type { CreatedUser } from "@/types/user";

type CreateUserPayload = Omit<RegisterInput, "confirmPassword">;

export const usersService = {
  async create(input: RegisterInput) {
    const payload: CreateUserPayload = {
      firstName: input.firstName,
      lastName: input.lastName,
      username: input.username,
      email: input.email,
      age: input.age,
      password: input.password,
    };

    const { data } = await httpClient.post<CreatedUser>("/users/add", payload);

    return data;
  },
};
