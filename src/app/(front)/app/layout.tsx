import AppClientLayout from "@/app/(front)/app/AppClientLayout";
import { LayoutProps } from "@/utils/types/props";

const AppLayout = async ({ children }: LayoutProps) => {
  return <AppClientLayout>{children}</AppClientLayout>;
};

export default AppLayout;
