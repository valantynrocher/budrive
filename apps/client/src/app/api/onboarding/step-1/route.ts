import { proxyAuthRequest } from "@/lib/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();

  const clientCookieHeader = request.headers.get("Cookie");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  if (clientCookieHeader) {
    requestOptions.headers = {
      ...requestOptions.headers,
      Cookie: clientCookieHeader,
    };
  }

  return proxyAuthRequest("/onboarding/step-1", requestOptions);
}
