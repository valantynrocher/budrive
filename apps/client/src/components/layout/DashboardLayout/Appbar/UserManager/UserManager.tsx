import ButtonBase from "@mui/material/ButtonBase";
import React from "react";
import Avatar from "@mui/material/Avatar";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const UserManager = () => {
  return (
    <ButtonBase
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
        bgcolor: "warning.light",
        borderRadius: 20,
        gap: 1,
        "&:hover": {
          backgroundColor: "warning.dark",
          "& svg": {
            color: "warning.light",
          },
        },
      }}
    >
      <Avatar
        sizes="small"
        alt="Riley Carter"
        sx={{
          width: 24,
          height: 24,
        }}
      />
      <SettingsOutlinedIcon
        sx={{
          color: "warning.dark",
        }}
      />
    </ButtonBase>
  );
};

export default UserManager;
