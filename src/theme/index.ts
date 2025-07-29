"use client";
import { extendTheme } from "@mui/material";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";

const theme = extendTheme({
  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
  colorSchemeSelector: "data-mui-color-scheme",
  cssVarPrefix: "dashboard",
  colorSchemes,
  typography,
  shadows,
  shape,
});

export default theme;
