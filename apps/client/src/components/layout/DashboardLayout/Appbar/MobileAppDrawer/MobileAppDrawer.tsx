import NavigationMenu from "@/components/layout/DashboardLayout/NavigationMenu/NavigationMenu";
import BudriveIcon from "@/components/ui/BudriveIcon";
import LogoutButtonManager from "@/components/ui/LogoutButtonManager";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Toolbar } from "@mui/material";
import Button from "@mui/material/Button";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";

interface MobileAppDrawerProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

const MobileAppDrawer = ({ open, toggleDrawer }: MobileAppDrawerProps) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
        }}
      >
        <Toolbar>
          <BudriveIcon sx={{ margin: "auto" }} />
        </Toolbar>

        <NavigationMenu />

        <Stack sx={{ p: 2 }}>
          <LogoutButtonManager
            Component={({ onClick }) => (
              <Button
                onClick={onClick}
                variant="outlined"
                fullWidth
                startIcon={<LogoutRoundedIcon />}
              >
                Déconnexion
              </Button>
            )}
          />
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default MobileAppDrawer;
