"use client";
import Appbar from "@/app/(front)/app/AppClientLayout/Appbar";
import Breadcrumbs from "@/app/(front)/app/AppClientLayout/Breadcrumbs";
import DesktopAppDrawer from "@/app/(front)/app/AppClientLayout/DesktopAppDrawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { AppClientLayoutProps } from "./props";
import AppbarOffset from "@/app/(front)/app/AppClientLayout/AppbarOffset";

const AppClientLayout = (props: AppClientLayoutProps) => {
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
            backgroundColor: "background.paper",
            borderTopLeftRadius: 8,
          }}
        >
          <Breadcrumbs />
          {children}
        </Stack>
      </Box>
    </Box>
  );
};

export default AppClientLayout;
