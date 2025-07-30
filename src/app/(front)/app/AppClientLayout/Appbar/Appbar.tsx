import UserManager from "@/app/(front)/app/AppClientLayout/Appbar/UserManager";
import { DRAWER_WIDTH } from "@/app/(front)/app/AppClientLayout/constants";
import BudriveIcon from "@/components/BudriveIcon";
import ColorModeManager from "@/components/ColorModeManager";
import LogoutButtonManager from "@/components/LogoutButtonManager";
import MenuButton from "@/components/MenuButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import MuiAppBar from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";
import MobileAppDrawer from "./MobileAppDrawer";

const Appbar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <MuiAppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "background.default",
        top: "var(--template-frame-height, 0px)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          width: "100%",
          padding: "8px 0 !important",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          bgcolor: "background.default",
        }}
        variant="regular"
      >
        {/* Left area */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            my: "auto",
            width: DRAWER_WIDTH,
            pl: 2,
          }}
        >
          <BudriveIcon sx={{ display: { xs: "none", md: "initial" } }} />

          <MenuButton
            sx={{
              display: { xs: "auto", md: "none" },
              bgcolor: "secondary.main",
              color: "secondary.dark",
              borderRadius: 1,
              p: 1,
              "&:hover": {
                backgroundColor: "secondary.dark",
                "& svg": {
                  color: "secondary.light",
                },
              },
            }}
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuRoundedIcon fontSize="small" />
          </MenuButton>
        </Stack>

        {/* Right area */}
        <Stack direction="row" sx={{ alignItems: "center", gap: 1, pr: 2 }}>
          <ColorModeManager />

          <UserManager />

          <LogoutButtonManager
            Component={({ onClick }) => (
              <MenuButton
                aria-label="menu"
                sx={{
                  bgcolor: "error.main",
                  color: "error.dark",
                  borderRadius: 1,
                  p: 1,
                  "&:hover": { backgroundColor: "error.dark" },
                }}
                onClick={onClick}
              >
                <LogoutRoundedIcon
                  fontSize="small"
                  sx={{ "&:hover": { color: "error.light" } }}
                />
              </MenuButton>
            )}
          />
        </Stack>

        <MobileAppDrawer open={open} toggleDrawer={toggleDrawer} />
      </Toolbar>
    </MuiAppBar>
  );
};

export default Appbar;
