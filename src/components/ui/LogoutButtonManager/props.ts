type ClickableComponentProps = {
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export type LogoutButtonManagerProps = {
  Component: React.ElementType<ClickableComponentProps>;
};
