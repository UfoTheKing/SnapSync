import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

type Props = {
  flashMode: FlashMode;
  onPress: () => void;
};

const FlashButton = (props: Props) => {
  const { flashMode, onPress } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {flashMode === FlashMode.off ? (
        <Ionicons name="flash-off" size={24} color="white" />
      ) : (
        <Ionicons name="flash" size={24} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default FlashButton;
