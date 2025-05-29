import { createTheme } from "@mui/material";
import { chartsCustomizations } from "./charts";
import dataDisplayCustomizations from "./dataDisplay";
import { dataGridCustomizations } from "./dataGrid";
import { datePickersCustomizations } from "./datePickers";
import { feedbackCustomizations } from "./feedback";
import { inputsCustomizations } from "./inputs";
import { navigationCustomizations } from "./navigation";
import { surfacesCustomizations } from "./surfaces";
import { colorSchemes, shadows, shape, typography } from "./themePrimitives";
import { treeViewCustomizations } from "./treeView";

const theme = createTheme({
  // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
  cssVariables: {
    colorSchemeSelector: "data-mui-color-scheme",
    cssVarPrefix: "template",
  },
  colorSchemes, // Recently added in v6 for building light & dark mode app, see https://mui.com/material-ui/customization/palette/#color-schemes
  typography,
  shadows,
  shape,
  components: {
    ...chartsCustomizations,
    ...dataDisplayCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...feedbackCustomizations,
    ...inputsCustomizations,
    ...navigationCustomizations,
    ...surfacesCustomizations,
    ...treeViewCustomizations,
  },
});

export { theme };
