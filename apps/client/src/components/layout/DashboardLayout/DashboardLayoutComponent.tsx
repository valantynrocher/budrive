"use client";
import Appbar from "@/components/layout/DashboardLayout/Appbar";
import AppbarOffset from "@/components/layout/DashboardLayout/AppbarOffset";
import DesktopAppDrawer from "@/components/layout/DashboardLayout/DesktopAppDrawer";
import Box from "@mui/material/Box";
import { DashboardLayoutProps } from "./props";

const DashboardLayoutComponent = (props: DashboardLayoutProps) => {
  const { children, withNavigation = true } = props;
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Appbar withNavigation={withNavigation} />

      {withNavigation ? <DesktopAppDrawer /> : null}

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

        <Box
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
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayoutComponent;
