"use client";
import React from "react";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material";
import { AuthLayoutProps } from "./props";
import BudriveIcon from "@/components/ui/BudriveIcon";
import Card from "@mui/material/Card";
import Link from "next/link";

const AuthLayoutComponent = (props: AuthLayoutProps) => {
  const { children } = props;
  const theme = useTheme();

  return (
    <Stack
      sx={{
        height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
        minHeight: "100%",
        padding: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
          padding: theme.spacing(4),
        },
        "&::before": {
          content: '""',
          display: "block",
          position: "absolute",
          zIndex: -1,
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
          backgroundRepeat: "no-repeat",
          ...theme.applyStyles("dark", {
            backgroundImage:
              "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
          }),
        },
      }}
      direction="column"
      justifyContent="space-between"
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          width: "100%",
          padding: theme.spacing(4),
          gap: theme.spacing(2),
          margin: "auto",
          boxShadow:
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
          [theme.breakpoints.up("sm")]: {
            width: "450px",
          },
          ...theme.applyStyles("dark", {
            boxShadow:
              "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
          }),
        }}
        variant="outlined"
      >
        <Link href="/">
          <BudriveIcon />
        </Link>
        {children}
      </Card>
    </Stack>
  );
};

export default AuthLayoutComponent;
