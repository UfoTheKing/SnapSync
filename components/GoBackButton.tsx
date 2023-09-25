import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export type GoBackButtonProps = {
  mode?: "light" | "dark";
  type?: "down" | "back";
  onPress: () => void;
  disabled?: boolean;
};

export const GO_BACK_BUTTON_LIGHT = "rgba(173, 191, 255, 0.3)";
export const GO_BACK_BUTTON_DARK = "#2A3341";

const GoBackButton = (props: GoBackButtonProps) => {
  const { mode = "dark", type = "back", onPress, disabled = false } = props;

  return (
    <TouchableOpacity
      style={[GoBackButtonStyles.button]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons
        name={type === "back" ? "chevron-back" : "chevron-down"}
        size={24}
        color={mode === "light" ? "white" : "black"}
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
