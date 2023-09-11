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
import { ScreenWidth } from "@/constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TurnCameraButton from "@/components/Camera/TurnCameraButton";
import BottomButton from "@/components/AuthStack/BottomButton/BottomButton";
import { useMutation } from "react-query";
import { AuthSignUp } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { useDispatch } from "react-redux";
import { login } from "@/business/redux/features/user/userSlice";

const AuthChooseProfilePicture = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthChooseProfilePicture">) => {
  const { userData } = route.params;

  const insets = useSafeAreaInsets();

  // REDUX
  const dispatch = useDispatch();

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
      allowsEditing: false,
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
          }}
        >
          <Image
            source={{ uri: imageToUse }}
            style={{
              width: ScreenWidth / 2,
              height: ScreenWidth / 2,
              borderRadius: 180,
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
      safeAreaTop={false}
    >
      <View
        style={[
          styles.containerCamera,
          {
            alignItems:
              !permission || !permission.granted ? "center" : "stretch",
            justifyContent:
              !permission || !permission.granted ? "center" : "flex-start",
          },
        ]}
      >
        {
          // Camera permissions are not granted yet
          !permission || !permission.granted ? (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              We need your permission to show the camera
            </Text>
          ) : permission.granted ? (
            <Camera
              ref={cameraRef}
              style={styles.containerCamera}
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
          ) : null
        }
      </View>
      <View
        style={{
          height: 100,
          width: ScreenWidth,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          position: "relative",
          zIndex: 1,
          alignItems: "center",
          justifyContent: "space-around",
          flexDirection: "row",
        }}
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
        <TouchableOpacity disabled={!isCameraReady} onPress={takePictureAsync}>
          <View
            style={{
              width: 75,
              height: 75,
              backgroundColor: "white",
              borderRadius: 100,
              borderWidth: 5,
              borderColor: "#d2d2d2",
            }}
          />
        </TouchableOpacity>
        <TurnCameraButton mode={type} onPress={toggleCameraType} />
      </View>
    </Container>
  );
};

export default AuthChooseProfilePicture;

const styles = StyleSheet.create({
  containerCamera: {
    flex: 1,
  },
  cameraHeader: {
    height: 75,
    width: ScreenWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
