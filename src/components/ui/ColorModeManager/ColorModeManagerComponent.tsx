import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import Box from "@mui/material/Box";
import IconButton, { IconButtonOwnProps } from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useColorScheme } from "@mui/material/styles";
import React, { useState } from "react";
import SystemIcon from "@mui/icons-material/DesktopMacRounded";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const ColorModeManager = (props: IconButtonOwnProps) => {
  const { mode, systemMode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMode = (targetMode: "system" | "light" | "dark") => () => {
    setMode(targetMode);
    handleClose();
  };

  if (!mode) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: "bottom",
          display: "inline-flex",
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: "1px solid",
          borderColor: (theme.vars || theme).palette.divider,
        })}
      />
    );
  }

  const resolvedMode = (systemMode || mode) as "light" | "dark";

  const iconModeMatcher = {
    light: <LightModeIcon fontSize="small" />,
    dark: <DarkModeIcon fontSize="small" />,
    system: <SystemIcon fontSize="small" />,
  };
  const ResolvedModeIcon = iconModeMatcher[resolvedMode];

  return (
    <React.Fragment>
      <IconButton
        data-screenshot="toggle-mode"
        onClick={handleClick}
        disableRipple
        size="small"
        aria-controls={open ? "color-scheme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          bgcolor: "primary.main",
          color: "primary.dark",
          borderRadius: 1,
          p: 1,
          "&:hover": {
            backgroundColor: "primary.dark",
            "& svg": {
              color: "primary.light",
            },
          },
        }}
        {...props}
      >
        {ResolvedModeIcon}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            variant: "outlined",
            elevation: 0,
          },
          list: {
            sx: {
              padding: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem selected={mode === "system"} onClick={handleMode("system")}>
          <ListItemIcon>{iconModeMatcher["system"]}</ListItemIcon>
          <ListItemText primary="Système" />
        </MenuItem>
        <MenuItem selected={mode === "light"} onClick={handleMode("light")}>
          <ListItemIcon>{iconModeMatcher["light"]}</ListItemIcon>
          <ListItemText primary="Clair" />
        </MenuItem>
        <MenuItem selected={mode === "dark"} onClick={handleMode("dark")}>
          <ListItemIcon>{iconModeMatcher["dark"]}</ListItemIcon>
          <ListItemText primary="Sombre" />
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default ColorModeManager;
