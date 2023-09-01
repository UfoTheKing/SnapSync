import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { RectTwoStyles } from "../styles";
import { Camera, CameraType, FlashMode } from "expo-camera";

type Props = {};

const FullLeft = (props: Props) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  React.useEffect(() => {
    requestPermission();
  }, []);

  return (
    <View style={RectTwoStyles.left}>
      {!permission ? null : !permission.granted ? (
        <Text>Permission not granted</Text>
      ) : (
        <Camera
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          type={CameraType.front}
          flashMode={FlashMode.off}
          ratio="16:9"
        />
      )}
    </View>
  );
};

export default FullLeft;

const styles = StyleSheet.create({});
