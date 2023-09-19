import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "native-base";

type Props = {
  label: string;
  onPress: () => void;
  disabled: boolean;
  isLoading: boolean;

  helpText?: string;
  onPressHelpText?: () => void;
  disabledHelpText?: boolean;
};

const BottomButton = (props: Props) => {
  const {
    onPress,
    disabled,
    isLoading,
    helpText,
    onPressHelpText,
    disabledHelpText = true,
  } = props;

  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          bottom: insets.bottom + 20,
        },
      ]}
    >
      <TouchableOpacity onPress={onPressHelpText} disabled={disabledHelpText}>
        <Text style={styles.helpText}>{helpText}</Text>
      </TouchableOpacity>
      <Button
        style={styles.button}
        disabled={disabled}
        isLoading={isLoading}
        onPress={onPress}
      >
        <Text style={styles.text}>{props.label}</Text>
      </Button>
    </View>
  );
};

export default BottomButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 400,
    position: "absolute",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  button: {
    borderRadius: 20,
    height: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  helpText: {
    fontSize: 14,
    color: "#999999",
    textAlign: "center",
    marginBottom: 20,
  },
});
