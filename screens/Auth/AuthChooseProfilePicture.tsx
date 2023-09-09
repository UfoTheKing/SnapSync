import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button as RnButton,
} from "react-native";
import React, { useState } from "react";
import { AuthStackScreenProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Container from "@/components/Container";
import { ScreenWidth } from "@/constants/Layout";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthSignUp } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import { useMutation } from "react-query";
import { authStyles } from "./AuthInsertFullName";
import { Button } from "native-base";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { useDispatch } from "react-redux";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { login } from "@/business/redux/features/user/userSlice";

type Props = {};

const AuthChooseProfilePicture = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthChooseProfilePicture">) => {
  const { userData } = route.params;

  const dispatch = useDispatch();

  const cameraRef = React.useRef<Camera>(null);

  const insets = useSafeAreaInsets();

  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [zoom, setZoom] = useState(0);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [firstImage, setFirstImage] = useState<string | null>(null);

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();

  const [imageToUse, setImageToUse] = useState<string | null>(null);

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
        if (error && instanceOfErrorResponseType(error)) {
          alert(error.message);
        }
      },
    }
  );

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
    if (imageToUse) {
    }
  }, [imageToUse]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Non lo faccio uscire dalla pagina
    });
  }, [navigation]);

  if (!permission) {
    // Camera permissions are still loading
    return null;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet

    return (
      <Container textCenter>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          We need your permission to show the camera
        </Text>
      </Container>
    );
  }

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

  // TODO: Capire perche il bottono non è centrato
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
              width: ScreenWidth / 2,
              height: ScreenWidth / 2,
              borderRadius: 180,
            }}
          />

          <RnButton
            title="Retry"
            onPress={() => setImageToUse(null)}
            disabled={SignUpMutation.isLoading}
          />
        </View>
        <View
          style={{
            ...authStyles.buttonContainer,
            bottom: insets.bottom,
          }}
        >
          <Button
            style={authStyles.button}
            isLoading={SignUpMutation.isLoading}
            onPress={() => {
              SignUpMutation.mutate({
                uri: imageToUse,
                sessionId: userData.sessionId,
              });
            }}
          >
            <Text
              style={{
                ...authStyles.buttonText,
              }}
            >
              Get Started
            </Text>
          </Button>
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
        style={{
          height: insets.top,
          width: ScreenWidth,
          backgroundColor: "#f7f7f7",
          // borderBottomLeftRadius: 10,
          // borderBottomRightRadius: 10,
          position: "relative",
          zIndex: 1,
          // top: 10,
        }}
      />
      <View style={styles.container}>
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
                <MaterialIcons name="flash-off" size={24} color="white" />
              ) : (
                <MaterialIcons name="flash-on" size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View
        style={{
          height: 100,
          width: ScreenWidth,
          backgroundColor: "#f7f7f7",
          // borderTopLeftRadius: 10,
          // borderTopRightRadius: 10,
          position: "relative",
          zIndex: 1,
          // bottom: 10,
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
        <TouchableOpacity onPress={toggleCameraType}>
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
            {type === CameraType.back ? (
              <MaterialIcons name="flip-to-front" size={24} color="white" />
            ) : (
              <MaterialIcons name="flip-to-back" size={24} color="white" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default AuthChooseProfilePicture;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
  },
  camera: {
    flex: 1,
    borderRadius: 10,
  },
  cameraHeader: {
    height: 75,
    width: ScreenWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
});
