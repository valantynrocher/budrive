import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/types/database";
import { formatRegistration } from "@/utils/fp/vehicles";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<
  | NextResponse<{
      error: string;
    }>
  | NextResponse<Tables<"vehicles">>
> {
  const { id } = await context.params;
  const {
    data: vehicle,
    error,
    status,
  } = await supabase.from("vehicles").select("*").eq("id", id).single();

  if (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status,
      }
    );
  }

  const data: Tables<"vehicles"> = {
    ...vehicle,
    registration: formatRegistration(vehicle.registration),
  };

  return NextResponse.json(data);
}
