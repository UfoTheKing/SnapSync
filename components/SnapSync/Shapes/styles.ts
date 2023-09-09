import { ScreenWidth } from "@/constants/Layout";
import { StyleSheet } from "react-native";

export const SnapSyncStyles = StyleSheet.create({
  inviteText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    letterSpacing: 1,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  username: {
    fontWeight: "bold",
    fontSize: 12,
    color: "white",
  },
});

export const RectTwoStyles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    height: "100%",
    borderRadius: 20,
    flexDirection: "row",
  },
  left: {
    width: ScreenWidth / 2,
    backgroundColor: "#c2c2c2",
    // borderTopLeftRadius: 20,
    // borderBottomLeftRadius: 20,
    borderRightColor: "white",
    borderRightWidth: 1,
    boxSizing: "border-box",
  },
  right: {
    width: ScreenWidth / 2,
    backgroundColor: "#c2c2c2",
    // borderTopRightRadius: 20,
    // borderBottomRightRadius: 20,
    borderLeftColor: "white",
    borderLeftWidth: 1,
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const SquareFourStyles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    height: 500,
    borderRadius: 20,
    // flexDirection: "row",
  },
  top: {
    flexDirection: "row",
    width: ScreenWidth,
    height: 250,
  },
  bottom: {
    flexDirection: "row",
    width: ScreenWidth,
    height: 250,
  },
  topLeft: {
    width: ScreenWidth / 2,
    height: 250,
    backgroundColor: "#c2c2c2",
    // borderTopLeftRadius: 20,
    // borderBottomLeftRadius: 20,
    borderRightColor: "white",
    borderRightWidth: 1,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    boxSizing: "border-box",
  },
  topRight: {
    width: ScreenWidth / 2,
    height: 250,
    backgroundColor: "#c2c2c2",
    // borderTopRightRadius: 20,
    // borderBottomRightRadius: 20,
    borderLeftColor: "white",
    borderLeftWidth: 1,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    boxSizing: "border-box",
  },
  bottomLeft: {
    width: ScreenWidth / 2,
    height: 250,
    backgroundColor: "#c2c2c2",
    // borderTopLeftRadius: 20,
    // borderBottomLeftRadius: 20,
    borderRightColor: "white",
    borderRightWidth: 1,
    borderTopColor: "white",
    borderTopWidth: 1,
    boxSizing: "border-box",
  },
  bottomRight: {
    width: ScreenWidth / 2,
    height: 250,
    backgroundColor: "#c2c2c2",
    // borderTopRightRadius: 20,
    // borderBottomRightRadius: 20,
    borderLeftColor: "white",
    borderLeftWidth: 1,
    borderTopColor: "white",
    borderTopWidth: 1,
    boxSizing: "border-box",
  },
});
