import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Spinner, useTheme } from "native-base";
import { InlineUserButtonsStyles } from "../styles";
import { AntDesign } from "@expo/vector-icons";
import { RIGHT_COMPONENT_MAX_WIDTH } from "../../styles";

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

const SyncButton = (props: Props) => {
  const { onPress, isLoading = false } = props;

  const colors = useTheme().colors;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.secondary[100],
        },
        styles.container,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <Spinner size="sm" color={colors.secondary[500]} />
      ) : (
        <>
          <AntDesign name="sync" size={16} color={colors.secondary[500]} />
          <Text
            style={[
              InlineUserButtonsStyles.text,
              {
                color: colors.secondary[500],
              },
            ]}
          >
            Sync
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default SyncButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: RIGHT_COMPONENT_MAX_WIDTH,
    height: 30,
    borderRadius: 15,
  },
});
