export type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export type WithRouteParamsProps<Params extends { [key: string]: string }> = {
  params: Promise<Params>;
};
