import AppClientLayout from "@/app/(front)/app/AppClientLayout";
import { supabase } from "@/utils/supabase/server";
import { LayoutProps } from "@/utils/types/props";
import { redirect } from "next/navigation";

const AppLayout = async (props: LayoutProps) => {
  const { children } = props;
  const { data, error } = await supabase.auth.getUser();
  console.log("AppLayout", {
    error,
    data,
  });

  if (error || !data?.user) {
    redirect("/auth/sign-in");
  }

  return <AppClientLayout>{children}</AppClientLayout>;
};

export default AppLayout;
