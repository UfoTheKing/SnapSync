import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";

type Props = {
  message: string;
  style?: StyleProp<TextStyle>;
};

const ErrorText = (props: Props) => {
  const { message } = props;
  return <Text style={[styles.text, props.style]}>{message}</Text>;
};

export default ErrorText;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
