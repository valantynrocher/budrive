import { SxProps, Theme } from "@mui/material/styles";

export type IconCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  sx?: SxProps<Theme>;
};
