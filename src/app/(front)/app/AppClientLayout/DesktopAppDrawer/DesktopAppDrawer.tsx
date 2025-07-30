import AppbarOffset from "@/app/(front)/app/AppClientLayout/AppbarOffset";
import { DRAWER_WIDTH } from "@/app/(front)/app/AppClientLayout/constants";
import NavigationMenu from "@/app/(front)/app/AppClientLayout/NavigationMenu/NavigationMenu";
import Box from "@mui/material/Box";
import Drawer, { drawerClasses } from "@mui/material/Drawer";

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
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <NavigationMenu />
        {/* <CardAlert /> */}
      </Box>
    </Drawer>
  );
};

export default DesktopAppDrawer;
