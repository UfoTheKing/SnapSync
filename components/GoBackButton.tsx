import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

export type GoBackButtonProps = {
  mode?: "light" | "dark";
  onPress: () => void;
  disabled?: boolean;
};

export const GO_BACK_BUTTON_LIGHT = "rgba(173, 191, 255, 0.3)";
export const GO_BACK_BUTTON_DARK = "#2A3341";

const GoBackButton = (props: GoBackButtonProps) => {
  const { mode = "dark", onPress, disabled = false } = props;

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
        name="arrowleft"
        size={24}
        color={props.mode === "light" ? "black" : "white"}
      />
    </TouchableOpacity>
  );
};

export default GoBackButton;

export const GoBackButtonStyles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
});
