import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/types/database";
import { formatRegistration } from "@/utils/fp/vehicles";

export async function GET(): Promise<
  | NextResponse<{
      error: string;
    }>
  | NextResponse<Tables<"vehicles">[]>
> {
  const {
    data: vehicles,
    error,
    status,
  } = await supabaseAdmin.from("vehicles").select("*");

  if (error)
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status,
      }
    );

  const data: Tables<"vehicles">[] = vehicles.map((v: Tables<"vehicles">) => ({
    ...v,
    registration: formatRegistration(v.registration),
  }));

  return NextResponse.json(data);
}
