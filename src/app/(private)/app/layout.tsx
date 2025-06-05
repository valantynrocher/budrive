import AppClientLayout from "@/app/(private)/app/AppClientLayout";
import { supabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type AppLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const AppLayout = async (props: AppLayoutProps) => {
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
