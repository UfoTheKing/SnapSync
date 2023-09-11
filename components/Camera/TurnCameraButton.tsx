import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { CameraType } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

type Props = {
  mode: CameraType;
  onPress: () => void;
};

const TurnCameraButton = (props: Props) => {
  const { mode, onPress } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {mode === CameraType.back ? (
        <Ionicons name="camera-reverse-outline" size={24} color="white" />
      ) : (
        <Ionicons name="camera-outline" size={24} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default TurnCameraButton;
