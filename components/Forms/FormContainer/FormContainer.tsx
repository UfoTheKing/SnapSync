import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React from "react";
import { ScreenWidth } from "@/constants/Layout";
import { MAX_WIDTH } from "./styles";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FormContainer = (props: Props) => {
  const { children, style } = props;

  return <View style={[styles.container, style]}>{children}</View>;
};

export default FormContainer;

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_WIDTH,
    width: ScreenWidth,
    paddingHorizontal: 20,
  },
});
