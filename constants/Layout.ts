import { Dimensions } from "react-native";

export const ScreenWidth = Math.round(Dimensions.get("window").width);
export const ScreenHeight = Math.round(Dimensions.get("window").height);

export const PlaceholderColor = "#c7c7c7";

export const Layout = {
  window: {
    width: ScreenWidth,
    height: ScreenHeight,
  },
  isSmallDevice: ScreenWidth < 375,
};
