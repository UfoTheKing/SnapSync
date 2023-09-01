import { Keyboard, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LightBackground } from "@/utils/theme";

type Props = {
  mode?: "light" | "dark";
  children?: React.ReactNode;
  safeAreaTop?: boolean;
  safeAreaBottom?: boolean;
  safeAreaLeft?: boolean;
  safeAreaRight?: boolean;
  dismissKeyboardEnabled?: boolean;

  textCenter?: boolean;

  onContainerPress?: () => void;
};

const Container = (props: Props) => {
  const {
    mode = "light",
    safeAreaTop = true,
    safeAreaBottom = true,
    safeAreaLeft = true,
    safeAreaRight = true,
    dismissKeyboardEnabled = true,
    textCenter = false,

    onContainerPress,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: mode === "light" ? LightBackground : "#000",
          paddingTop: safeAreaTop ? insets.top : 0,
          paddingBottom: safeAreaBottom ? insets.bottom : 0,
          paddingLeft: safeAreaLeft ? insets.left : 0,
          paddingRight: safeAreaRight ? insets.right : 0,

          alignItems: textCenter ? "center" : undefined,
          justifyContent: textCenter ? "center" : undefined,
        },
      ]}
      onTouchStart={() => {
        if (dismissKeyboardEnabled) {
          Keyboard.dismiss();
        }

        onContainerPress?.();
      }}
    >
      {props.children}
    </View>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
