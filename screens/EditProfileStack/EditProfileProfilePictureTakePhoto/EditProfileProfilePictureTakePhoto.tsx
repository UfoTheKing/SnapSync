import { Button, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { EditProfileStackScreenProps } from "@/types";
import GoBackButton from "@/components/GoBackButton";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Container from "@/components/Container";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import TakePhotoButton from "@/components/Camera/TakePhotoButton/TakePhotoButton";
import TurnCameraButton from "@/components/Camera/TurnCameraButton/TurnCameraButton";
import FlashButton from "@/components/Camera/FlashButton/FlashButton";
import { useDispatch } from "react-redux";
import { setUriProfilePicture } from "@/business/redux/features/editprofile/editProfileSlice";

const EditProfileProfilePictureTakePhoto = ({
  navigation,
}: EditProfileStackScreenProps<"EditProfileProfilePictureTakePhoto">) => {
  // REDUX
  const dispatch = useDispatch();

  // REFS
  const cameraRef = React.useRef<Camera>(null);

  // STATES
  const [type, setType] = useState(CameraType.front);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  React.useEffect(() => {
    requestPermission();
  }, []);

  // FUNCTIONS
  const toggleCameraType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  const toggleFlashMode = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.torch : FlashMode.off);
  };

  const takePictureAsync = async () => {
    if (cameraRef && cameraRef.current) {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
        // base64: true,
      });

      dispatch(setUriProfilePicture(uri));
      navigation.goBack();
    }
  };

  return (
    <Container safeAreaTop={false}>
      <View style={styles.container}>
        {!permission || !permission.granted ? (
          <>
            <ErrorText message="You need to grant camera permissions" />
            <Button title="Grant permission" onPress={requestPermission} />
          </>
        ) : permission && permission.granted ? (
          <View style={styles.preview}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={type}
              flashMode={flashMode}
              onCameraReady={() => setIsCameraReady(true)}
            />
          </View>
        ) : null}
      </View>
      {isCameraReady && (
        <View style={styles.footer}>
          <FlashButton flashMode={flashMode} onPress={toggleFlashMode} />
          <TakePhotoButton
            disabled={!isCameraReady}
            onPress={takePictureAsync}
          />
          <TurnCameraButton mode={type} onPress={toggleCameraType} />
        </View>
      )}
    </Container>
  );
};

export default EditProfileProfilePictureTakePhoto;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    maxHeight: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    justifyContent: "center",
    marginTop: 20,
  },
  footer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 20,
  },
  preview: {
    width: "100%",
    height: "100%",
    // maxHeight: 360,
    // maxWidth: 360,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
    // maxHeight: 360,
    // maxWidth: 360,
  },
});
