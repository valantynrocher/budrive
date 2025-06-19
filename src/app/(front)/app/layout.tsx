import AppClientLayout from "@/app/(front)/app/AppClientLayout";
import { Database } from "@/utils/supabase/types";
import { LayoutProps } from "@/utils/types/props";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AppLayout = async ({ children }: LayoutProps) => {
  const cookieStore = cookies(); // ici, `cookies()` est en réalité sync (contrairement à `headers()`)
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/sign-in");
  }

  return <AppClientLayout>{children}</AppClientLayout>;
};

export default AppLayout;
