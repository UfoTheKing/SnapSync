import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { INLINE_USER_HEIGHT } from "../styles";
import Avatar from "../Avatar/Avatar";
import Info from "../Info/Info";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
};

const InlineSkeleton = (props: Props) => {
  const { containerStyle } = props;
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.boxUserInfos}>
        <Avatar isLoading />
        <Info isLoading />
      </View>
    </View>
  );
};

export default InlineSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: INLINE_USER_HEIGHT,
    backgroundColor: "white",
  },
  boxUserInfos: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 5,
    flex: 2,
    height: INLINE_USER_HEIGHT,
    // backgroundColor: "blue",
  },
});
