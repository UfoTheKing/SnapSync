import { TouchableOpacity } from "react-native";
import React from "react";
import { InlineUserButtonsStyles } from "../styles";
import { Spinner, useTheme } from "native-base";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

const AddButton = (props: Props) => {
  const { onPress, isLoading } = props;

  const colors = useTheme().colors;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.secondary[100],
        },
        InlineUserButtonsStyles.container,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <Spinner size="sm" color={colors.secondary[900]} />
      ) : (
        <AntDesign name="adduser" size={16} color={colors.secondary[900]} />
      )}
    </TouchableOpacity>
  );
};

export default AddButton;
