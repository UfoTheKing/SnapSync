import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { LightBackground } from "@/utils/theme";

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

const TakePhotoButton = (props: Props) => {
  const { onPress, disabled } = props;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <View
        style={{
          width: 75,
          height: 75,
          backgroundColor: LightBackground,
          borderRadius: 100,
          borderWidth: 5,
          borderColor: "#d2d2d2",
        }}
      />
    </TouchableOpacity>
  );
};

export default TakePhotoButton;

const styles = StyleSheet.create({});
