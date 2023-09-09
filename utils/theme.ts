import { extendTheme } from "native-base";

// Define the config
const config = {
  useSystemColorMode: false,
  initialColorMode: "light",
};

// extend the theme
export const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: "#d6e9f5",
      100: "#c1ddf0",
      200: "#acd2ec",
      300: "#98c7e7",
      400: "#83bce2",
      500: "#6eb1dd",
      600: "#5aa6d8",
      700: "#459ad3",
      800: "#308fcf",
      900: "#2e86c1",
    },
    secondary: {
      50: "#fef9e7",
      100: "#fcf3cf",
      200: "#fbedb7",
      300: "#f9e79f",
      400: "#f8e187",
      500: "#f7db6e",
      600: "#f5d556",
      700: "#f4cf3e",
      800: "#f2ca26",
      900: "#f1c40f",
    },
    red: {
      50: "#ffe8e6",
      100: "#ffd0cc",
      200: "#ffb9b3",
      300: "#ffa299",
      400: "#ff8a80",
      500: "#ff6f61",
      600: "#ff5b4d",
      700: "#ff4433",
      800: "#ff2d1a",
      900: "#ff1500",
    },
  },
  components: {
    Input: {
      baseStyle: {
        _focus: {
          borderColor: "primary.50",
          backgroundColor: "white",
        },
        _hover: {
          borderColor: "primary.500",
        },
        _disabled: {
          borderColor: "gray.300",
          backgroundColor: "gray.100",
        },
        _invalid: {
          borderColor: "red.500",
        },
      },
    },
  },
});

export const textColorGray = "#737373";

export const LightBackground = "#fff";

type MyThemeType = typeof theme;
declare module "native-base" {
  interface ICustomTheme extends MyThemeType {}
}
