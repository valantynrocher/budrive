export const AuthToken = {
  ACCESS_TOKEN_COOKIE_NAME: "access_token",
  REFRESH_TOKEN_COOKIE_NAME: "refresh_token",
} as const;

export type AuthTokenKey = keyof typeof AuthToken;
