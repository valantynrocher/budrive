import { proxyAuthRequest } from "@/lib/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const clientCookieHeader = request.headers.get("Cookie");

  // Si le header Cookie est présent, l'ajouter à la requête vers le backend
  if (clientCookieHeader) {
    requestOptions.headers = {
      ...requestOptions.headers,
      Cookie: clientCookieHeader,
    };
  }

  return proxyAuthRequest("/auth/refresh", requestOptions);
}
