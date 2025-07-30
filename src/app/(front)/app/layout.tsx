import { VehicleProvider } from "@/components/contexts/VehicleContext";
import PrivateAppLayoutComponent from "@/components/layout/PrivateAppLayout";
import { LayoutProps } from "@/utils/types/props";

const AppLayout = async ({ children }: LayoutProps) => {
  return (
    <VehicleProvider>
      <PrivateAppLayoutComponent>{children}</PrivateAppLayoutComponent>
    </VehicleProvider>
  );
};

export default AppLayout;
