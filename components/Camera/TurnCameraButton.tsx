import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { CameraType } from "expo-camera";

type Props = {
  mode: CameraType;
  onPress: () => void;
};

const TurnCameraButton = (props: Props) => {
  return (
    <View>
      <Text>TurnCameraButton</Text>
    </View>
  );
};

export default TurnCameraButton;

const styles = StyleSheet.create({});
