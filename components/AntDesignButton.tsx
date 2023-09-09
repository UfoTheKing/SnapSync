import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import {
  GO_BACK_BUTTON_DARK,
  GO_BACK_BUTTON_LIGHT,
  GoBackButtonProps,
  GoBackButtonStyles,
} from "./GoBackButton";
import { AntDesign } from "@expo/vector-icons";

type AntDesignButtonProps = GoBackButtonProps & {
  name: React.ComponentProps<typeof AntDesign>["name"];
};

const AntDesignButton = (props: AntDesignButtonProps) => {
  const { mode = "dark", onPress, disabled = false, name } = props;
  return (
    <TouchableOpacity
      style={[
        GoBackButtonStyles.button,
        {
          backgroundColor:
            mode === "light" ? GO_BACK_BUTTON_LIGHT : GO_BACK_BUTTON_DARK,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <AntDesign
        name={name}
        size={24}
        color={props.mode === "light" ? "black" : "white"}
      />
    </TouchableOpacity>
  );
};

export default AntDesignButton;

const styles = StyleSheet.create({});
