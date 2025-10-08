import { NextRequest, NextResponse } from "next/server";
import { config } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const clientCookieHeader = request.headers.get("Cookie");

    const fetchOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Si le header Cookie est présent, l'ajouter à la requête vers le backend
    if (clientCookieHeader) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Cookie: clientCookieHeader,
      };
    }

    // Transmet la requête du client au serveur NestJS
    const backendResponse = await fetch(
      `${config.backendUrl}/auth/refresh`,
      fetchOptions
    );

    // Erreur du Backend (ex: 401 Unauthorized car Refresh Token expiré)
    if (!backendResponse.ok) {
      return new NextResponse(null, {
        status: backendResponse.status,
        statusText: "Unauthorized",
      });
    }

    // Succès : Récupérer les NOUVEAUX cookies du backend
    const setCookieHeaders = backendResponse.headers.getSetCookie();

    // Créer la réponse pour le client
    const response = new NextResponse(null, { status: 200 });

    // Retransmettre les NOUVEAUX cookies au navigateur du client
    if (setCookieHeaders.length > 0) {
      for (const cookie of setCookieHeaders) {
        response.headers.append("Set-Cookie", cookie);
      }
    }

    return response;
  } catch (error) {
    console.error("Erreur du proxy d'authentification:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
