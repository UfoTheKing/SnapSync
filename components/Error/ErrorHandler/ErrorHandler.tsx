import { StyleProp, TextStyle } from "react-native";
import React from "react";
import ErrorText from "../ErrorText/ErrorText";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {
  error: unknown;
  style?: StyleProp<TextStyle>;
};

const ErrorHandler = (props: Props) => {
  const { error, style } = props;
  return (
    <ErrorText
      style={style}
      message={
        error && instanceOfErrorResponseType(error)
          ? error.message
          : "Something went wrong"
      }
    />
  );
};

export default ErrorHandler;
