import { StyleSheet, Text } from "react-native";
import React from "react";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { FetchSnapSyncShapes } from "@/api/routes/snaps_sync";
import Container from "@/components/Container";
import { SnapSyncStackScreenProps } from "@/types";
import { Spinner } from "native-base";
import ShapeMenu, { DELAY } from "@/components/SnapSync/ShapeMenu";
import RectTwo from "@/components/SnapSync/Shapes/RectTwo/RectTwo";
import {
  changeShape,
  initShape,
  initSnapInstanceKey,
  joinUser,
  reset,
  resetUsers,
} from "@/business/redux/features/snapsync/snapSyncSlice";
import { LightBackground } from "@/utils/theme";
import { createWssMessage } from "@/utils/utils";
import { getDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { WssActions } from "@/utils/wss";
import Toast from "react-native-toast-message";
import SquareFour from "@/components/SnapSync/Shapes/SquareFour/SquareFour";

type Props = {};

const CreateScreen = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"Create">) => {
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const ws = useSelector((state: RootState) => state.socket.ws);
  const shape = useSelector((state: RootState) => state.snapSync.shape);
  const users = useSelector((state: RootState) => state.snapSync.users);
  const key = useSelector((state: RootState) => state.snapSync.key);

  const dispatch = useDispatch();

  const [menuShapeOpen, setMenuShapeOpen] = React.useState(false);

  const [isLoadingCreateSnapeInstace, setIsLoadingCreateSnapInstace] =
    React.useState(false);

  const {
    data: shapes,
    isLoading,
    isError,
  } = useQuery("shapes", () => FetchSnapSyncShapes(tokenApi), {
    enabled: isLoggedIn && ws !== null,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "",
      headerLeft: () => null,
      headerStyle: {
        backgroundColor: LightBackground,
      },
    });

    navigation.addListener("beforeRemove", (e) => {
      if (ws && key) {
        // Distruggo la SnapInstance
        const message = createWssMessage(
          tokenApi,
          null,
          WssActions.DeleteSnapInstance,
          null
        );

        ws.send(message);
      }
      dispatch(reset());
    });
  }, [navigation, route.params.createdByMe, key, ws]);

  React.useEffect(() => {
    if (shapes) {
      dispatch(initShape(shapes.shapes[0]));
    }
  }, [shapes]);

  React.useEffect(() => {
    async function createSnapInstace() {
      const deviceUuid = await getDeviceUuid();
      if (deviceUuid) {
        setIsLoadingCreateSnapInstace(true);

        const message = createWssMessage(
          tokenApi,
          deviceUuid,
          WssActions.CreateSnapInstace,
          {
            snapInstanceShapeId: shape?.id,
            users: users,
          }
        );

        ws?.send(message);
      }
    }

    if (ws && shape && shape.numberOfUsers - 1 === users.length) {
      createSnapInstace();
    }
  }, [shape, users, ws]);

  React.useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        const message = JSON.parse(e.data);

        console.log("MESSAGE", message);

        if (message.action === WssActions.CreateSnapInstace) {
          setIsLoadingCreateSnapInstace(false);

          if (message.success) {
            let key =
              message.data && message.data.key ? message.data.key : undefined;
            console.log("KEY", key);
            if (key) {
              dispatch(initSnapInstanceKey(key));
            }
          } else {
            let message = "Something went wrong, please try again later.";
            Toast.show({
              type: "error",
              text1: "Error",
              text2: message,
            });
            // navigation.goBack();
            dispatch(resetUsers());
          }
        } else if (message.action === WssActions.JoinSnapInstance) {
          let userId = message.data.userId;
          let timer = message.data.timer;

          console.log("JOIN SNAP INSTANCE", userId, timer);

          dispatch(joinUser(userId));
        }
      };
    }
  }, [ws]);

  if (!ws) {
    return (
      <Container textCenter>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          You need to be logged in to create a SnapSync
        </Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container textCenter>
        <Spinner size="sm" />
      </Container>
    );
  }

  return (
    <Container>
      {shape ? (
        shape.name === "RECT_2" ? (
          <RectTwo
            shape={shape}
            onPressInvite={(position) => {
              navigation.navigate("Invite", {
                position,
              });
            }}
          />
        ) : shape.name === "SQUARE_4" ? (
          <SquareFour />
        ) : null
      ) : null}

      {key ? null : (
        <ShapeMenu
          shape={shape}
          shapes={(shapes && shapes.shapes) || []}
          open={menuShapeOpen}
          toggleOpen={() => {
            let newValue = !menuShapeOpen;
            if (!newValue) {
              // Aspetto Delay e chiudo
              setTimeout(() => {
                setMenuShapeOpen(newValue);
              }, DELAY);
            } else {
              setMenuShapeOpen(newValue);
            }
          }}
          disabled={isLoadingCreateSnapeInstace || key !== null}
          changeShape={(shape) => {
            dispatch(changeShape(shape));
          }}
        />
      )}
    </Container>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({});
