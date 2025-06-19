import MobileSidebar from "@/app/(front)/app/AppClientLayout/Sidebar/MobileSidebar";
import BudriveIcon from "@/components/BudriveIcon";
import ColorModeIconDropdown from "@/components/ColorModeIconDropdown";
import LogoutButtonManager from "@/components/LogoutButtonManager";
import MenuButton from "@/components/MenuButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import { tabsClasses } from "@mui/material/Tabs";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";

const MobileTopbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: 0,
        bgcolor: "background.paper",
        backgroundImage: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center",
          gap: "12px",
          flexShrink: 0,
          [`& ${tabsClasses.flexContainer}`]: {
            gap: "8px",
            p: "8px",
            pb: 0,
          },
        }}
        variant="regular"
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "center", mr: "auto" }}
          >
            <BudriveIcon />
          </Stack>
          <ColorModeIconDropdown />
          <LogoutButtonManager
            Component={({ onClick }) => (
              <MenuButton aria-label="menu" onClick={onClick}>
                <LogoutRoundedIcon />
              </MenuButton>
            )}
          />
          <MenuButton aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuRoundedIcon />
          </MenuButton>
          <MobileSidebar open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default MobileTopbar;
