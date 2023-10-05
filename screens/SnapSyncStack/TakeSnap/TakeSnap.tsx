import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
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
import { useMutation } from "react-query";
import { SendSnap } from "@/api/routes/snaps_sync";
import { WssActions } from "@/utils/wss";

const TakeSnap = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"TakeSnap">) => {
  const { key } = route.params;

  // REDUX
  const ws = useSelector((state: RootState) => state.socket.ws);
  const isLogged = useSelector((state: RootState) => state.socket.isLogged);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  // REFS
  const cameraRef = React.useRef<Camera>(null);

  // HOOKS
  const insets = useSafeAreaInsets();
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
      headerShown: !isLogged && !key ? true : true,
      headerShadowVisible: false,
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
      headerTitle: "",
    });
  }, [navigation, isLogged, key]);

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

  // FUNCTIONS

  if (!ws || !isLogged) {
    return (
      <Container textCenter>
        <ErrorText message="There is no connection to the server. Please try again later" />
      </Container>
    );
  }

  if (!key) {
    return (
      <Container textCenter>
        <ErrorText message="Ops! Something went wrong. Please try again later." />
      </Container>
    );
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

  return (
    <Container textCenter>
      <Text>{key}</Text>
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
