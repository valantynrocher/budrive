import AuthLayout from "@/components/layout/AuthLayout";
import { LayoutProps } from "@/utils/types/props";

const AuthPagesLayout = (props: LayoutProps) => {
  const { children } = props;
  return <AuthLayout>{children}</AuthLayout>;
};

export default AuthPagesLayout;
