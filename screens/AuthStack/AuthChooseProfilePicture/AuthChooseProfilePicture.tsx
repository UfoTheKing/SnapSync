import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
} from "react-native";
import React, { useState } from "react";
import { AuthStackScreenProps } from "@/types";
import { Camera, CameraType, FlashMode } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import Container from "@/components/Container";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TurnCameraButton from "@/components/Camera/TurnCameraButton/TurnCameraButton";
import BottomButton from "@/components/Auth/BottomButton/BottomButton";
import { useMutation } from "react-query";
import { AuthSignUp } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { useDispatch } from "react-redux";
import { login } from "@/business/redux/features/user/userSlice";
import TakePhotoButton from "@/components/Camera/TakePhotoButton/TakePhotoButton";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import ErrorText from "@/components/Error/ErrorText/ErrorText";

const AuthChooseProfilePicture = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthChooseProfilePicture">) => {
  const { userData } = route.params;

  // REDUX
  const dispatch = useDispatch();

  // HOOKS
  const insets = useSafeAreaInsets();

  // REFS
  const cameraRef = React.useRef<Camera>(null);

  // MUTATIONS
  const SignUpMutation = useMutation(
    (data: { uri: string; sessionId: string }) =>
      AuthSignUp(data.uri, data.sessionId),
    {
      onSuccess: async (data) => {
        // Faccio il login
        await storeAuthToken(data.accessToken);
        await storeDeviceUuid(data.device.uuid);
        dispatch(login(data));
      },
      onError: (error) => {
        let message = "An error occurred";
        if (error && instanceOfErrorResponseType(error)) {
          message = error.message;
        }

        Toast.show({
          type: "error",
          text1: message,
          position: "bottom",
        });
      },
    }
  );

  // QUERIES

  // STATES
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [firstImage, setFirstImage] = useState<string | null>(null);
  const [imageToUse, setImageToUse] = useState<string | null>(null);

  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  // EFFECTS
  React.useEffect(() => {
    requestPermission();
    requestMediaLibraryPermission();
  }, []);

  React.useEffect(() => {
    const getFirstImage = async () => {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 1,
        mediaType: MediaLibrary.MediaType.photo,
      });

      if (assets.length > 0) {
        setFirstImage(assets[0].uri);
      }
    };

    if (mediaLibraryPermission && mediaLibraryPermission.granted) {
      getFirstImage();
    }
  }, [mediaLibraryPermission]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Non lo faccio uscire dalla pagina
    });
  }, [navigation]);

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

      setImageToUse(uri);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageToUse(result.assets[0].uri);
    }
  };

  if (imageToUse) {
    return (
      <Container>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: imageToUse }}
            style={{
              width: SCREEN_WIDTH / 2,
              height: SCREEN_WIDTH / 2,
              borderRadius: 150,
              maxWidth: 300,
              maxHeight: 300,
            }}
          />

          <Button
            title="Retry"
            onPress={() => setImageToUse(null)}
            disabled={SignUpMutation.isLoading}
          />

          <BottomButton
            label="Get Started"
            isLoading={SignUpMutation.isLoading}
            disabled={SignUpMutation.isLoading}
            onPress={() => {
              SignUpMutation.mutate({
                uri: imageToUse,
                sessionId: userData.sessionId,
              });
            }}
          />
        </View>
      </Container>
    );
  }

  return (
    <Container
      safeAreaBottom={true}
      safeAreaLeft={false}
      safeAreaRight={false}
      safeAreaTop={true}
    >
      <View
        style={{
          alignItems: "center",
          flex: 1,
          width: SCREEN_WIDTH,
          maxHeight: SCREEN_WIDTH,
        }}
      >
        <View style={styles.preview}>
          {!permission || !permission.granted ? (
            <ErrorText message="We need your permission to show the camera" />
          ) : permission.granted ? (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              type={type}
              flashMode={flashMode}
              zoom={zoom}
              onCameraReady={() => setIsCameraReady(true)}
            >
              <View style={styles.cameraHeader}>
                <TouchableOpacity onPress={toggleFlashMode}>
                  {flashMode === FlashMode.off ? (
                    <Ionicons name="flash-off" size={24} color="white" />
                  ) : (
                    <Ionicons name="flash" size={24} color="white" />
                  )}
                </TouchableOpacity>
              </View>
            </Camera>
          ) : null}
        </View>
      </View>
      <View
        style={[
          styles.footer,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: "gray",
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {firstImage ? (
              <Image
                source={{ uri: firstImage }}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 100,
                }}
              />
            ) : null}
          </View>
        </TouchableOpacity>
        <TakePhotoButton disabled={!isCameraReady} onPress={takePictureAsync} />
        <TurnCameraButton mode={type} onPress={toggleCameraType} />
      </View>
    </Container>
  );
};

export default AuthChooseProfilePicture;

const styles = StyleSheet.create({
  preview: {
    width: "100%",
    height: "100%",
    // maxHeight: 360,
    // maxWidth: 360,
    borderRadius: 30,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
    // maxHeight: 360,
    // maxWidth: 360,
  },
  cameraHeader: {
    height: 75,
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  footer: {
    flex: 1,
    maxHeight: 100,
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    marginTop: 20,
  },
});
