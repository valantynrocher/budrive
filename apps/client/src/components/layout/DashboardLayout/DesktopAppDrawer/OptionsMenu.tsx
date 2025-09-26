import LogoutButtonManager from "@/components/ui/LogoutButtonManager";
import MenuButton from "@/components/ui/MenuButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import Divider, { dividerClasses } from "@mui/material/Divider";
import { listClasses } from "@mui/material/List";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import React, { useState } from "react";

export default function OptionsMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        <MenuItem sx={{ margin: "2px 0" }} onClick={handleClose}>
          Profile
        </MenuItem>

        <MenuItem sx={{ margin: "2px 0" }} onClick={handleClose}>
          My account
        </MenuItem>

        <Divider />

        <MenuItem sx={{ margin: "2px 0" }} onClick={handleClose}>
          Add another account
        </MenuItem>

        <MenuItem sx={{ margin: "2px 0" }} onClick={handleClose}>
          Settings
        </MenuItem>

        <Divider />

        <LogoutButtonManager
          Component={({ onClick }) => (
            <MenuItem
              onClick={onClick}
              sx={{
                margin: "2px 0",
                [`& .${listItemIconClasses.root}`]: {
                  ml: "auto",
                  minWidth: 0,
                },
              }}
            >
              <ListItemText>Déconnexion</ListItemText>
              <ListItemIcon>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
          )}
        />
      </Menu>
    </React.Fragment>
  );
}
