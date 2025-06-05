import AuthClientLayout from "@/app/(front)/auth/AuthClientLayout";
import { LayoutProps } from "@/utils/types/props";

const AuthLayout = (props: LayoutProps) => {
  const { children } = props;
  return <AuthClientLayout>{children}</AuthClientLayout>;
};

export default AuthLayout;
