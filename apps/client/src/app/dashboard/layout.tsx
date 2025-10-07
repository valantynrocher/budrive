import { SessionProvider } from "@/components/contexts/SessionContext";
import { VehicleProvider } from "@/components/contexts/VehicleContext";
import DashboardLayoutWrapper from "@/components/layout/DashboardLayout";
import { LayoutProps } from "@/utils/types/props";

const DashboardLayout = async ({ children }: LayoutProps) => {
  return (
    <SessionProvider>
      <VehicleProvider>
        <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
      </VehicleProvider>
    </SessionProvider>
  );
};

export default DashboardLayout;
