import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FlashMode } from "expo-camera";

type Props = {
  flashMode: FlashMode;
  onPress: () => void;
};

const FlashButton = (props: Props) => {
  return (
    <View>
      <Text>FlashButton</Text>
    </View>
  );
};

export default FlashButton;

const styles = StyleSheet.create({});
