import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { RectTwoStyles } from "../styles";
import { Camera, CameraType, FlashMode } from "expo-camera";

type Props = {
  cameraType: CameraType;
  flashMode: FlashMode;
  isTimerCompleted: boolean;

  onPictureTaken: (uri: string) => void;
};

const FullLeft = (props: Props) => {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = React.useRef<Camera>(null);

  React.useEffect(() => {
    requestPermission();
  }, []);

  React.useEffect(() => {
    if (props.isTimerCompleted && permission?.granted) {
    }
  }, [props.isTimerCompleted]);

  const takePictureAsync = async () => {
    if (cameraRef && cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
        // base64: true,
      });

      props.onPictureTaken(uri);
    }
  };

  return (
    <View style={RectTwoStyles.left}>
      {!permission ? null : !permission.granted ? (
        <Text>Permission not granted</Text>
      ) : (
        <Camera
          style={{ width: "100%", height: "100%" }}
          type={props.cameraType}
          flashMode={props.flashMode}
          ratio="16:9"
        />
      )}
    </View>
  );
};

export default FullLeft;

const styles = StyleSheet.create({});
