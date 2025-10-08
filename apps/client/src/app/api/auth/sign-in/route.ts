import { proxyAuthRequest } from "@/lib/api";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const requestOptions: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };

  return proxyAuthRequest("/auth/sign-in", requestOptions);
}
