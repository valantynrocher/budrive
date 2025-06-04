import AuthClientLayout from "@/app/(auth)/(components)//AuthClientLayout";

type AppLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

const AuthLayout = (props: AppLayoutProps) => {
  const { children } = props;
  return <AuthClientLayout>{children}</AuthClientLayout>;
};

export default AuthLayout;
