import { httpClient } from "@/api/httpClient";
import type { LoginInput } from "@/schemas/loginSchema";
import type { AuthApiResponse, AuthRefreshResponse, AuthSession, AuthUser } from "@/types/auth";

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
      user: toUser(data),
    };
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
      user: currentUser,
    };
  },
};
