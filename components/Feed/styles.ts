import { StyleSheet } from "react-native";

export const FEED_HEADER_HEIGHT = 48;
export const FEED_HEADER_PADDING_X = 16;
export const FEED_FOOTER_MAX_HEIGHT = 50;

export const FeedStyles = StyleSheet.create({
  containerUsername: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  containerText: {
    flex: 9,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  containerLike: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#000",
    letterSpacing: 0.5,
  },
  text: {
    fontSize: 12,
    color: "#000",
    letterSpacing: 0.5,
    // lineHeight: 14,
  },
});
