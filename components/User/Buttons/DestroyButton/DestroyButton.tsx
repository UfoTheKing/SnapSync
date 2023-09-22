import { StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "native-base";
import { InlineUserButtonsStyles } from "../styles";
import { Spinner } from "native-base";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

const DestroyButton = (props: Props) => {
  const { onPress, isLoading } = props;

  const colors = useTheme().colors;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.error[100],
        },
        InlineUserButtonsStyles.container,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <Spinner size="sm" color={colors.error[500]} />
      ) : (
        <AntDesign name="close" size={16} color={colors.error[500]} />
      )}
    </TouchableOpacity>
  );
};

export default DestroyButton;

const styles = StyleSheet.create({});
