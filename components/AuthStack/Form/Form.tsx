import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { ScreenWidth } from "@/constants/Layout";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const Form = (props: Props) => {
  const { children, style } = props;

  return <View style={[styles.container, style]}>{children}</View>;
};

export default Form;

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    width: ScreenWidth,
    paddingHorizontal: 20,
  },
});
