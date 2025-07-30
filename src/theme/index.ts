"use client";
import { alpha, extendTheme } from "@mui/material/styles";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";

const theme = extendTheme({
  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
  colorSchemeSelector: "data-mui-color-scheme",
  cssVarPrefix: "dashboard",
  colorSchemes,
  typography,
  shadows,
  shape,
  components: {
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.contrastText,
            "& .MuiSvgIcon-root": {
              color: theme.palette.primary.contrastText,
            },
          },
          "&.Mui-selected:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.8),
          },
        }),
      },
    },
  },
});

export default theme;
