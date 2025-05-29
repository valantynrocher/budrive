import { serviceClient } from "@/utils/supabase/client";

export async function GET() {
  const response = await serviceClient.from("vehicles").select("*");

  return new Response(JSON.stringify(response), {
    headers: { "Content-Type": "application/json" },
  });
}
