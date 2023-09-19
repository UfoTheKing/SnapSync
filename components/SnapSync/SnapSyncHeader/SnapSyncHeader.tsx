import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "native-base";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const SnapSyncHeader = (props: Props) => {
  const { onPress, disabled } = props;

  const insets = useSafeAreaInsets();

  const colors = useTheme().colors;

  return (
    <View
      style={[
        {
          top: insets.top + (StatusBar.currentHeight || 0) + 30,
          height: 50,
          left: insets.left + 30,
        },
        styles.container,
      ]}
    >
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <Text
          style={{
            color: colors.red[500],
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Leave
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SnapSyncHeader;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    zIndex: 100,
    elevation: 100,
    width: "100%",
    backgroundColor: "transparent",
  },
});
