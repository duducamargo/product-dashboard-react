import { httpClient } from "@/api/httpClient";
import type { LoginInput } from "@/schemas/loginSchema";
import type { RegisterInput } from "@/schemas/registerSchema";
import { usersService } from "@/services/usersService";
import type { AuthApiResponse, AuthRefreshResponse, AuthSession, AuthUser } from "@/types/auth";
import { localAccountStorage } from "@/utils/localAccountStorage";

function toUser(data: AuthApiResponse): AuthUser {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    image: data.image,
  };
}

export const authService = {
  async login(input: LoginInput): Promise<AuthSession> {
    try {
      const { data } = await httpClient.post<AuthApiResponse>(
        "/auth/login",
        {
          ...input,
          expiresInMins: 30,
        },
        {
          withCredentials: true,
        }
      );

      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        provider: "dummyjson",
        user: toUser(data),
      };
    } catch (error) {
      const localSession = localAccountStorage.login(input.username, input.password);

      if (!localSession) {
        throw error;
      }

      return localSession;
    }
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    const createdUser = await usersService.create(input);
    return localAccountStorage.create(input, createdUser.id);
  },

  async refresh(refreshToken: string, currentUser: AuthUser): Promise<AuthSession> {
    const { data } = await httpClient.post<AuthRefreshResponse>(
      "/auth/refresh",
      {
        refreshToken,
        expiresInMins: 30,
      },
      {
        withCredentials: true,
      }
    );

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      provider: "dummyjson",
      user: currentUser,
    };
  },
};
