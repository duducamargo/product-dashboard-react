export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  provider: "dummyjson" | "local";
  user: AuthUser;
};

export type AuthApiResponse = AuthUser & {
  accessToken: string;
  refreshToken: string;
};

export type AuthRefreshResponse = {
  accessToken: string;
  refreshToken: string;
};
