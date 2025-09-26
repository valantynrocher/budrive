"use client";
import { Database } from "@/utils/supabase/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient<Database>();

export { supabase };
