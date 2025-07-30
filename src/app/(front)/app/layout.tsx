import PrivateAppLayoutComponent from "@/components/layout/PrivateAppLayout";
import { LayoutProps } from "@/utils/types/props";

const AppLayout = async ({ children }: LayoutProps) => {
  return <PrivateAppLayoutComponent>{children}</PrivateAppLayoutComponent>;
};

export default AppLayout;
