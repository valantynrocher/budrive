import { VehicleProvider } from "@/components/contexts/VehicleContext";
import DashboardLayoutWrapper from "@/components/layout/DashboardLayout";
import { LayoutProps } from "@/utils/types/props";

const DashboardLayout = async ({ children }: LayoutProps) => {
  return (
    <VehicleProvider>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </VehicleProvider>
  );
};

export default DashboardLayout;
