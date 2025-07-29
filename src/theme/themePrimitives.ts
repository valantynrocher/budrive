import { createTheme, Shadows } from "@mui/material/styles";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}
declare module "@mui/material/styles" {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  interface Palette {
    baseShadow: string;
  }
}

const defaultTheme = createTheme();

export const myPalette = {
  yellow: {
    hex: "#ede342",
    rgb: [237, 227, 66],
    cmyk: [0, 4, 72, 7],
    hsb: [56, 72, 93],
    hsl: [56, 83, 59],
    lab: [89, -14, 75],
  },
  orange: {
    hex: "#f2bf6c",
    rgb: [242, 191, 108],
    cmyk: [0, 21, 55, 5],
    hsb: [37, 55, 95],
    hsl: [37, 84, 69],
    lab: [80, 9, 48],
  },
  coral: {
    hex: "#f69a97",
    rgb: [246, 154, 151],
    cmyk: [0, 37, 39, 4],
    hsb: [2, 39, 96],
    hsl: [2, 84, 78],
    lab: [73, 34, 16],
  },
  pink: {
    hex: "#fb76c1",
    rgb: [251, 118, 193],
    cmyk: [0, 53, 23, 2],
    hsb: [326, 53, 98],
    hsl: [326, 94, 72],
    lab: [68, 59, -15],
  },
  purple: {
    hex: "#ff51eb",
    rgb: [255, 81, 235],
    cmyk: [0, 68, 8, 0],
    hsb: [307, 68, 100],
    hsl: [307, 100, 66],
    lab: [64, 81, -43],
  },
};

export const colorSchemes = {
  light: {
    palette: {
      primary: defaultTheme.palette.augmentColor({
        color: {
          main: myPalette.yellow.hex,
        },
      }),
      secondary: defaultTheme.palette.augmentColor({
        color: {
          main: myPalette.pink.hex,
        },
      }),
      warning: defaultTheme.palette.augmentColor({
        color: {
          main: myPalette.orange.hex,
        },
      }),
      error: defaultTheme.palette.augmentColor({
        color: {
          main: myPalette.coral.hex,
        },
      }),
      info: defaultTheme.palette.augmentColor({
        color: {
          main: myPalette.purple.hex,
        },
      }),
      background: {
        default: "#ffffff",
        paper: "#f9f9f9",
      },
      text: {
        primary: "#1a1a1a",
        secondary: "#4a4a4a",
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
    },
  },
  dark: {
    palette: {
      primary: defaultTheme.palette.augmentColor({
        color: {
          main: "#d3c836", // dérivé de yellow adapté au dark
        },
      }),
      secondary: defaultTheme.palette.augmentColor({
        color: {
          main: "#ff9adb", // pink un peu plus pastel
        },
      }),
      warning: defaultTheme.palette.augmentColor({
        color: {
          main: "#e5a85c", // orange atténué
        },
      }),
      error: defaultTheme.palette.augmentColor({
        color: {
          main: "#e07c7a", // coral plus doux
        },
      }),
      info: defaultTheme.palette.augmentColor({
        color: {
          main: "#e56ff0", // purple désaturé
        },
      }),
      background: {
        default: "#121212",
        paper: "#1e1e1e",
      },
      text: {
        primary: "#ffffff",
        secondary: "#bbbbbb",
      },
      baseShadow:
        "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px",
    },
  },
};

export const typography = {
  fontFamily: "Inter, sans-serif",
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

// @ts-expect-error ignore
const defaultShadows: Shadows = [
  "none",
  "var(--template-palette-baseShadow)",
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
