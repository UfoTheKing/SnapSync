import { Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { authStyles } from "@/screens/Auth/styles";
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
      style={{
        ...authStyles.buttonContainer,
        bottom: insets.bottom,
        justifyContent: "flex-start",
      }}
    >
      <TouchableOpacity onPress={onPressHelpText} disabled={disabledHelpText}>
        <Text style={authStyles.helpText}>{helpText}</Text>
      </TouchableOpacity>
      <Button
        style={authStyles.button}
        disabled={disabled}
        isLoading={isLoading}
        onPress={onPress}
      >
        <Text
          style={{
            ...authStyles.buttonText,
          }}
        >
          {props.label}
        </Text>
      </Button>
    </View>
  );
};

export default BottomButton;
