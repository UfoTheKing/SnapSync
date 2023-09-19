import React from "react";
import { useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  size?: number;
};

const Verified = (props: Props) => {
  const { size = 16 } = props;
  const colors = useTheme().colors;
  return (
    <Ionicons
      name="checkmark-circle"
      size={size}
      color={colors.primary[900]}
      style={{ marginLeft: 4 }}
    />
  );
};

export default Verified;
