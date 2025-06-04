"use client";
import { createTheme } from "@mui/material";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";

const theme = createTheme({
  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
    cssVarPrefix: "dashboard",
  },
  colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
  typography,
  shadows,
  shape,
});

export default theme;
