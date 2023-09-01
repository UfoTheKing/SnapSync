import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SquareFourStyles } from "../styles";
import { Camera, CameraType, FlashMode } from "expo-camera";

type Props = {};

const TopLeft = (props: Props) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={SquareFourStyles.topLeft}>
      {!permission ? null : !permission.granted ? (
        <Text>Permission not granted</Text>
      ) : (
        <Camera
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          type={CameraType.front}
          flashMode={FlashMode.off}
          ratio="1:1"
        />
      )}
    </View>
  );
};

export default TopLeft;

const styles = StyleSheet.create({});
