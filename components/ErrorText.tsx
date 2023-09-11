import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import React from "react";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {
  error: unknown;
  style?: StyleProp<TextStyle>;
};

const ErrorText = (props: Props) => {
  const { error } = props;
  return (
    <Text style={[styles.text, props.style]}>
      {error && instanceOfErrorResponseType(error)
        ? error.message
        : "Something went wrong"}
    </Text>
  );
};

export default ErrorText;

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
