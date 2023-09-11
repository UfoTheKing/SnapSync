import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { SnapSyncStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import Container from "@/components/Container";
import { useQuery } from "react-query";
import {
  CheckSnapInstance,
  FetchSnapSyncShapes,
} from "@/api/routes/snaps_sync";
import { Spinner, useTheme } from "native-base";
import { instanceOfErrorResponseType } from "@/api/client";
import { Shape } from "@/models/project/Shape";
import { createWssMessage } from "@/utils/utils";
import { WssActions } from "@/utils/wss";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TurnCameraButton from "@/components/Camera/TurnCameraButton";
import { CameraType, FlashMode } from "expo-camera";
import FlashButton from "@/components/Camera/FlashButton";
import {} from "react-native-gesture-handler";
import ShapeMenu from "@/components/SnapSync/ShapeMenu";

type Props = {};

const SnapSyncScreen = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"SnapSync">) => {
  const { mode, key } = route.params;

  const insets = useSafeAreaInsets();

  const colors = useTheme().colors;

  const ws = useSelector((state: RootState) => state.socket.ws);
  const isLogged = useSelector((state: RootState) => state.socket.isLogged);

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const snapSync = useSelector((state: RootState) => state.snapSync.snapSync);

  const [initialShape, setInitialShape] = React.useState<Shape | null>(null);
  const [isShapeMenuOpen, setIsShapeMenuOpen] = React.useState<boolean>(false);

  const [camMode, setCamMode] = React.useState<CameraType>(CameraType.front);
  const [camFlahs, setCamFlash] = React.useState<FlashMode>(FlashMode.off);

  const {
    data: shapes,
    isLoading,
    isError,
    error,
  } = useQuery("shapes", () => FetchSnapSyncShapes(tokenApi), {
    enabled: isLoggedIn && mode === "create",
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });

  const {
    data: check,
    isLoading: isLoadingCheck,
    isError: isErrorCheck,
    error: errorCheck,
  } = useQuery(
    ["check", key, tokenApi],
    () => CheckSnapInstance(tokenApi, key || ""),
    {
      enabled: isLoggedIn && mode === "join" && key !== undefined,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    }
  );

  React.useEffect(() => {
    if (shapes && shapes.shapes && shapes.shapes.length > 0) {
      setInitialShape(shapes.shapes[0]);
    }
  }, [shapes]);

  React.useEffect(() => {
    if (ws && check && check.isJoinable && mode === "join" && key) {
      let m = createWssMessage(
        WssActions.JoinSnapInstance,
        undefined,
        undefined,
        {
          key: key,
        }
      );

      console.log("Sending message", m);
    }
  }, [ws, mode, key, check]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (snapSync) {
        console.log("Sending message LEAVE");
      }
    });
  }, [snapSync, navigation]);

  if (!ws || !isLogged) {
    return (
      <Container textCenter>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          There is no connection to the server.
        </Text>
      </Container>
    );
  }

  if (mode === "create") {
    if (isLoading) {
      return (
        <Container textCenter>
          <Spinner size="sm" />
        </Container>
      );
    }

    if (isError || !shapes) {
      return (
        <Container textCenter>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {error && instanceOfErrorResponseType(error)
              ? error.message
              : "Something went wrong"}
          </Text>
        </Container>
      );
    }

    if (shapes.shapes.length === 0) {
      return (
        <Container textCenter>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Ops! There is no shape available for SnapSync
          </Text>
        </Container>
      );
    }
  }

  if (mode === "join") {
    if (isLoadingCheck) {
      return (
        <Container textCenter>
          <Spinner size="sm" />
        </Container>
      );
    }

    if (isErrorCheck || !check) {
      return (
        <Container textCenter>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {errorCheck && instanceOfErrorResponseType(errorCheck)
              ? errorCheck.message
              : "Something went wrong"}
          </Text>
        </Container>
      );
    }

    if (check && !check.isJoinable) {
      return (
        <Container textCenter>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Ops! This SnapSync is not joinable anymore
          </Text>
        </Container>
      );
    }
  }

  return (
    <Container safeAreaLeft={false} safeAreaRight={false} safeAreaTop={false}>
      <View style={styles.shapeContainer}>
        <Text>Shape</Text>
      </View>
      <View
        style={[
          styles.footerContainer,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}
      >
        <View style={styles.options}>
          <FlashButton
            onPress={() => {
              setCamFlash(
                camFlahs === FlashMode.off ? FlashMode.on : FlashMode.off
              );
            }}
            flashMode={camFlahs}
          />

          <ShapeMenu shape={initialShape} isOpen={isShapeMenuOpen} />

          <TurnCameraButton
            onPress={() => {
              setCamMode(
                camMode === CameraType.back ? CameraType.front : CameraType.back
              );
            }}
            mode={camMode}
          />
        </View>
        <View style={styles.leave}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text
              style={[
                styles.leaveText,
                {
                  color: colors.red[500],
                },
              ]}
            >
              Leave SnapSync
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default SnapSyncScreen;

const styles = StyleSheet.create({
  shapeContainer: {
    flex: 2,
    backgroundColor: "red",
  },
  footerContainer: {
    flex: 1,
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    alignItems: "center",
  },
  leave: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
