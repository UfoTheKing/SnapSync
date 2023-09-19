import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import React from "react";
import { SnapSyncStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import GoBackButton from "@/components/GoBackButton";
import Container from "@/components/Container";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { ScreenWidth } from "@/constants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useCountdown from "@bradgarropy/use-countdown";
import { useTheme } from "native-base";
import { SystemMessage } from "@/models/wss/SystemMessage";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
import { SendSnap } from "@/api/routes/snaps_sync";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { WssActions } from "@/utils/wss";
import SnapSyncTitle from "@/components/SnapSync/SnapSyncTitle/SnapSyncTitle";
import { Ionicons } from "@expo/vector-icons";
import { Portal } from "react-native-portalize";
import { BlurView } from "expo-blur";

const TakeSnap = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"TakeSnap">) => {
  const { key, cHeight, cWidth, shape, position } = route.params;

  // REDUX
  const snapSync = useSelector((state: RootState) => state.snapSync.snapSync);
  const ws = useSelector((state: RootState) => state.socket.ws);
  const isLogged = useSelector((state: RootState) => state.socket.isLogged);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  // REFS
  const cameraRef = React.useRef<Camera>(null);

  // HOOKS
  const insets = useSafeAreaInsets();
  const countdown = useCountdown({
    minutes: snapSync?.timer.minutes || 0,
    seconds: snapSync?.timer.seconds || 10,
    format: "mm:ss",
    autoStart: false,
    onCompleted: () => takeSnap(),
  });
  const colors = useTheme().colors;

  // STATES
  const [cameraType, setCameraType] = React.useState(CameraType.front);
  const [flashMode, setFlashMode] = React.useState(FlashMode.off);
  const [forceReturnToHome, setForceReturnToHome] = React.useState(false);
  const [uri, setUri] = React.useState<string | null>(null);

  // MUTATIONS
  const mutation = useMutation(
    (data: { key: string; uri: string; tokenApi: string }) =>
      SendSnap(data.uri, data.key, data.tokenApi)
  );

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
      headerTitle: "",
    });
    navigation.addListener("beforeRemove", (e) => {
      if (ws && isLogged && snapSync && !forceReturnToHome) {
        e.preventDefault();
      } else {
        navigation.dispatch(e.data.action);
      }
    });
  }, [navigation, snapSync, forceReturnToHome, ws, isLogged]);

  React.useEffect(() => {
    if (ws && isLogged) {
      ws.onmessage = (e) => {
        let data = JSON.parse(e.data) as SystemMessage;
        if (data && data.data && data.data.exit) {
          let message = "Ops! Something went wrong. Please try again later.";
          if (data.message) {
            message = data.message;
          }

          Toast.show({
            type: "error",
            text1: "Error",
            text2: message,
          });

          // Significa che è successo qualcosa: un utente è uscito, ecc...
          // Forze l'utente a tornare indietro
          setForceReturnToHome(true);
        } else {
          if (data && data.action === WssActions.SendSnap && data.data) {
            // navigation.navigate("PublishSnap", {
            //   key: key,
            //   image: data.data.image,
            //   shape: shape,
            // });
          }
        }
      };
    }
  }, [ws, isLogged]);

  React.useEffect(() => {
    if (forceReturnToHome) {
      // Rimuovo gli screen TakeSnap e SnapSync dalla history e torno alla TabHomeStack
      navigation.navigate("Root", {
        screen: "TabHomeStack",
      });
    }
  }, [forceReturnToHome, navigation]);

  // FUNCTIONS
  const takeSnap = async () => {
    if (cameraRef.current && snapSync) {
      const photo = await cameraRef.current.takePictureAsync();
      const { uri } = photo;
      // Faccio il resize dell'immagine senza fare il fill
      // const manipResult = await manipulateAsync(
      //   uri,
      //   [{ resize: { width: position.width, height: position.height } }],
      //   { compress: 1, format: SaveFormat.PNG, base64: false }
      // );
      // let data = {
      //   key: key,
      //   uri: manipResult.uri,
      //   tokenApi: tokenApi,
      // };
      // mutation.mutate(data);

      setUri(uri);
    }
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === CameraType.front ? CameraType.back : CameraType.front
    );
  };

  const toggleFlashMode = () => {
    setFlashMode(flashMode === FlashMode.off ? FlashMode.on : FlashMode.off);
  };

  if (!ws || !isLogged) {
    return (
      <Container textCenter>
        <ErrorText message="There is no connection to the server. Please try again later" />
      </Container>
    );
  }

  if (!snapSync || !snapSync.timer || !snapSync.timer.start) {
    <Container textCenter>
      <ErrorText message="SnapSync not found" />
    </Container>;
  }

  // if (mutation.isLoading) {
  //   return (
  //     <Container>
  //       <LottieView
  //         source={require("@/assets/animations/upload.json")}
  //         autoPlay={true}
  //         loop={true}
  //         duration={3000}
  //         style={{
  //           ...StyleSheet.absoluteFillObject,
  //         }}
  //       />
  //     </Container>
  //   );
  // }

  // if (mutation.isSuccess) {
  //   return (
  //     <Container>
  //       <LottieView
  //         source={require("@/assets/animations/collage.json")}
  //         autoPlay={true}
  //         loop={true}
  //         duration={3000}
  //         style={{
  //           ...StyleSheet.absoluteFillObject,
  //         }}
  //       />
  //     </Container>
  //   );
  // }

  // if (mutation.isError) {
  //   return (
  //     <Container textCenter>
  //       <ErrorText message="Ops! Something went wrong. Please try again later." />
  //     </Container>
  //   );
  // }

  if (uri) {
    return (
      <Container textCenter>
        <Image
          source={{ uri: uri }}
          style={{
            width: cWidth,
            height: cHeight,
          }}
        />
        <Button
          title="Retry"
          onPress={() => {
            setUri(null);
            countdown.reset();
          }}
        />
      </Container>
    );
  }

  return (
    <Container
      safeAreaLeft={false}
      safeAreaRight={false}
      safeAreaTop={false}
      safeAreaBottom={false}
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginTop: insets.top,
          maxHeight: shape.height,
          maxWidth: shape.width,
          marginBottom: insets.bottom,
        }}
      >
        <Camera
          ref={cameraRef}
          style={{
            width: cWidth,
            height: cHeight,
          }}
          type={cameraType}
          flashMode={flashMode}
          onCameraReady={() => countdown.start()}
        >
          <View
            style={{
              height: 50,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => toggleFlashMode()}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {flashMode === FlashMode.off ? (
                  <Ionicons name="flash-off" size={24} color="white" />
                ) : (
                  <Ionicons name="flash" size={24} color="white" />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleCameraType()}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cameraType === CameraType.back ? (
                  <Ionicons
                    name="camera-reverse-outline"
                    size={24}
                    color="white"
                  />
                ) : (
                  <Ionicons name="camera-outline" size={24} color="white" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View
        style={{
          height: 50 + insets.bottom,
          width: ScreenWidth,
          paddingLeft: insets.left,
          paddingRight: insets.right,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SnapSyncTitle
          message={snapSync!.title.replaceAll(
            "{{timer}}",
            countdown.seconds.toString()
          )}
        />
      </View>
    </Container>
  );
};

export default TakeSnap;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
