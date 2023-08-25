import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  mode?: "light" | "dark";
  onPress: () => void;
  disabled?: boolean;
};

const GoBackButton = (props: Props) => {
  const { mode = "dark", onPress, disabled = false } = props;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor:
            mode === "light" ? "rgba(173, 191, 255, 0.3)" : "#2A3341",
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

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
});
