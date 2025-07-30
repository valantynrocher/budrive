"use client";
import Appbar from "@/components/layout/PrivateAppLayout/Appbar";
import AppbarOffset from "@/components/layout/PrivateAppLayout/AppbarOffset";
import DesktopAppDrawer from "@/components/layout/PrivateAppLayout/DesktopAppDrawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { PrivateAppLayoutProps } from "./props";

const PrivateAppLayoutComponent = (props: PrivateAppLayoutProps) => {
  const { children } = props;
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Appbar />

      {/* MobileAppDrawer is rendered inside AppBar */}
      <DesktopAppDrawer />

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <AppbarOffset />

        <Stack
          spacing={2}
          sx={{
            flexGrow: 1,
            alignItems: "center",
            px: 3,
            pt: 2,
            pb: 3,
            mr: 2,
            backgroundColor: "background.paper",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default PrivateAppLayoutComponent;
