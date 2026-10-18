export type ApiUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  provider: "email" | "google";
  emailVerified: boolean;
  createdAt: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  /** Seconds until the access token expires */
  expiresIn: number;
};

export type AuthResponse = {
  user: ApiUser;
  tokens: Tokens;
};
