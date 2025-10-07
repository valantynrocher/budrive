import { AuthToken } from "@budrive/validation";
import { CookieOptions, Response } from "express"; // Importez le type Request pour l'accès aux cookies

// cookies duration (ms)
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: isProduction ? "strict" : "lax",
    domain: "localhost",
  };

  // Access Token (short duration Cookie)
  res.cookie(AuthToken.ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + ACCESS_TOKEN_MAX_AGE),
  });

  // Refresh Token (long duration Cookie)
  res.cookie(AuthToken.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + REFRESH_TOKEN_MAX_AGE),
  });
};

export const clearAuthCookies = (res: Response) => {
  res.cookie(AuthToken.ACCESS_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie(AuthToken.REFRESH_TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
