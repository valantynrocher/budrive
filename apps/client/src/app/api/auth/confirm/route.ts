import { config } from "@/utils/config";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import parseSetCookie from "set-cookie-parser";

type SameSiteType = ResponseCookie["sameSite"];

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const backendResponse = await fetch(`${config.backendUrl}/auth/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
      credentials: "include",
    });

    const backendBody = await backendResponse.json();

    if (!backendResponse.ok) {
      return NextResponse.json(backendBody, {
        status: backendResponse.status,
      });
    }

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
    const response = NextResponse.json(backendBody, { status: 200 });

    return response;
  } catch (error) {
    console.error("Erreur du Route Handler /api/auth/confirm:", error);
    return NextResponse.json(
      {
        message: "Erreur interne du serveur lors de la confirmation.",
      },
      {
        status: 500,
      }
    );
  }
}
