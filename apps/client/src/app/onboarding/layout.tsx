import { SessionProvider } from "@/components/contexts/SessionContext";
import DashboardLayoutWrapper from "@/components/layout/DashboardLayout";
import { LayoutProps } from "@/utils/types/props";

const OnboardingLayout = async ({ children }: LayoutProps) => {
  return (
    <SessionProvider>
      <DashboardLayoutWrapper withNavigation={false}>
        {children}
      </DashboardLayoutWrapper>
    </SessionProvider>
  );
};

export default OnboardingLayout;
