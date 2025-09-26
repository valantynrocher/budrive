import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useTheme } from "@mui/material";
import MuiBreadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const Breadcrumbs = () => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
      spacing={2}
    >
      <MuiBreadcrumbs
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
        <Typography variant="body1">Tableau de bord</Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          Accueil
        </Typography>
      </MuiBreadcrumbs>
    </Stack>
  );
};

export default Breadcrumbs;
