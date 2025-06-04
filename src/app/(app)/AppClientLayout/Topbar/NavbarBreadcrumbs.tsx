import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useTheme } from "@mui/material";

export default function NavbarBreadcrumbs() {
  const theme = useTheme();
  return (
    <Breadcrumbs
      sx={{
        margin: theme.spacing(1, 0),
        [`& .${breadcrumbsClasses.separator}`]: {
          color: (theme.vars || theme).palette.action.disabled,
          margin: 1,
        },
        [`& .${breadcrumbsClasses.ol}`]: {
          alignItems: "center",
        },
      }}
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Budrive</Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.primary", fontWeight: 600 }}
      >
        Accueil
      </Typography>
    </Breadcrumbs>
  );
}
