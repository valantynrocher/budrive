export const AuthToken = {
  NAME: "access_token",
  CONFIRM_SUCCESS: "Compte confirmé et utilisateur connecté",
} as const;

export type AuthTokenKey = keyof typeof AuthToken;
