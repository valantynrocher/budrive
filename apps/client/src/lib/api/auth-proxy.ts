import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import parseSetCookie from "set-cookie-parser";
import config from "./config";

type SameSiteType = ResponseCookie["sameSite"];

/**
 * Gère une requête de proxy vers le backend et propage les cookies de session
 * de la réponse du backend vers la réponse Next.js.
 * @param endpointPath Le chemin de l'endpoint NestJS (ex: '/auth/login').
 * @param requestOptions Les options de fetch (méthode, headers, body, etc.).
 * @returns Une NextResponse pour le client Next.js.
 */
export async function proxyAuthRequest(
  endpointPath: string,
  requestOptions: RequestInit
): Promise<NextResponse> {
  try {
    // 1. Appel au backend
    const backendResponse = await fetch(`${config.backendUrl}${endpointPath}`, {
      ...requestOptions,
      cache: "no-store",
      credentials: "include",
    });

    const backendBody = await backendResponse.json();

    // 2. Si le backend renvoie une erreur (ex: 401, 400), la propager immédiatement
    if (!backendResponse.ok) {
      return NextResponse.json(backendBody, {
        status: backendResponse.status,
      });
    }

    // 3. Succès : Préparer la réponse Next.js
    const nextResponse = NextResponse.json(backendBody, { status: 200 });

    // 4. Propagation des cookies HTTP-Only
    const setCookieHeader = backendResponse.headers.getSetCookie();

    if (setCookieHeader) {
      const parsedCookies = parseSetCookie.parse(setCookieHeader, {
        map: true,
      });

      for (const name in parsedCookies) {
        const cookie = parsedCookies[name];

        const sameSiteValue: SameSiteType =
          (cookie.sameSite?.toLowerCase() as SameSiteType) || undefined;

        (await cookies()).set(name, cookie.value, {
          path: cookie.path,
          domain: cookie.domain,
          expires: cookie.expires,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: sameSiteValue,
        });
      }
    }

    // 5. Renvoyer la réponse finale avec les cookies
    return nextResponse;
  } catch (error) {
    console.error(`Erreur dans le proxy pour ${endpointPath}:`, error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
