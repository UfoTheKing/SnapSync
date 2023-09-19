import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: JSX.Element;
  color?: string;

  bottomDivider?: boolean;
};

const BottomSheetModalItem = (props: Props) => {
  const {
    label,
    onPress,

    disabled = false,
    icon = null,
    color = "#000",

    bottomDivider = false,
  } = props;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={{ color: color, ...styles.text }}>{label}</Text>
      </View>

      {bottomDivider && <View style={{ height: 1, backgroundColor: "#eee" }} />}
    </TouchableOpacity>
  );
};

export default BottomSheetModalItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    height: 50,
    // backgroundColor: "red",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
});
