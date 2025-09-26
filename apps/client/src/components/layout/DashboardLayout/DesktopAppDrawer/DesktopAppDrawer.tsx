import AppbarOffset from "@/components/layout/DashboardLayout/AppbarOffset";
import { DRAWER_WIDTH } from "@/components/layout/DashboardLayout/constants";
import NavigationMenu from "@/components/layout/DashboardLayout/NavigationMenu/NavigationMenu";
import VehicleSelector from "@/components/VehicleSelector";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

const DesktopAppDrawer = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        bgcolor: "background.default",
        [`& .${drawerClasses.paper}`]: {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "background.default",
          borderRight: "none",
        },
        display: { xs: "none", md: "block" },
      }}
    >
      <AppbarOffset />
      <Stack
        direction="column"
        height="100%"
        overflow="auto"
        sx={{ padding: 1 }}
      >
        <VehicleSelector />
        <NavigationMenu />
        {/* <CardAlert /> */}
      </Stack>
    </Drawer>
  );
};

export default DesktopAppDrawer;
