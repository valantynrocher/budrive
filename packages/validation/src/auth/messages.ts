export const AuthErrors = {
  EMAIL_REQUIRED: "L'e-mail est obligatoire",
  EMAIL_INVALID: "L'e-mail doit être valide",
  PASSWORD_REQUIRED: "Le mot de passe est obligatoire",
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères",
  CONFIRM_PASSWORD_NOT_MATCH: "Les deux mots de passe ne correspondent pas",
  INVALID_CREDENTIALS: "L'e-mail et/ou le mot de passe sont incorrects",
  EMAIL_ALREADY_EXISTS: "Cet e-mail est déjà utilisé par un utilisateur",
  TOKEN_REQUIRED: "Le token est obligatoire",
  TOKEN_INVALID_EXPIRED: "Ce lien n'est plus valide",
  URL_CONFIRM_TOKEN_MISSING: "Le lien de confirmation n'est pas valide",
  CONFIRM_TOKEN_UNKNOW_ERROR:
    "Une erreur est survenue lors de la confirmation d'inscription. Veuillez réessayer ultérieurement",
  RESRESH_TOKEN_MISSING: "Refresh token manquant",
  REFRESH_TOKEN_INVALID: "Format du refresh token invalide",
  SESSION_EXPIRED_INVALID: "Session expirée ou invalide",
} as const;

export type AuthErrorKey = keyof typeof AuthErrors;

export const AuthSuccess = {
  USER_CONFIRMED: "Compte confirmé et utilisateur connecté",
  LOGOUT: "Déconnexion réussie",
};

export type AuthSuccessKey = keyof typeof AuthSuccess;
