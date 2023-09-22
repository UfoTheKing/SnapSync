import { TouchableOpacity } from "react-native";
import React from "react";
import { InlineUserButtonsStyles } from "../styles";
import { Spinner, useTheme } from "native-base";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  isLoading?: boolean;
};

const AcceptButton = (props: Props) => {
  const { onPress, isLoading } = props;

  const colors = useTheme().colors;

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: colors.success[100],
        },
        InlineUserButtonsStyles.container,
      ]}
      onPress={onPress}
    >
      {isLoading ? (
        <Spinner size="sm" color={colors.success[900]} />
      ) : (
        <AntDesign name="check" size={16} color={colors.success[900]} />
      )}
    </TouchableOpacity>
  );
};

export default AcceptButton;
