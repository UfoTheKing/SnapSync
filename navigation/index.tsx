import React from "react";
import { ILoginResponse } from "@/models/auth/Auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { useTheme } from "native-base";
import TopTabNavigator from "./TopTabNavigator";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import AuthStack from "./AuthStack";
import { login } from "@/business/redux/features/user/userSlice";
import UserProfileStack from "./UserProfileStack";
import SnapSyncStack from "./SnapSyncStack";
import { WSS_URL } from "@/api/client";
import { WssActions } from "@/utils/wss";
import { initWs, resetWs } from "@/business/redux/features/socket/socketSlice";
import { createWssMessage } from "@/utils/utils";
import EditProfileStack from "./EditProfileStack";
import UserSettingsStack from "./UserSettingsStack";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  data?: ILoginResponse;
};

const RootNavigation = ({ data }: Props) => {
  const colors = useTheme().colors;

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const isLogged = useSelector((state: RootState) => state.socket.isLogged);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);
  const [dataCopy, setDataCopy] = React.useState<ILoginResponse | undefined>(
    data
  );
  const [stateWs, setStateWs] = React.useState<WebSocket | undefined>(
    undefined
  );

  React.useEffect(() => {
    const loginAuthToken = async () => {
      if (dataCopy && !isLoggedIn) {
        // Invalido la props data in modo da non ripetere il login, nel caso in cui l'utente faccia logout
        // e poi ritorni alla schermata di login
        setDataCopy(undefined);

        dispatch(login(dataCopy));

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    loginAuthToken();
  }, [dataCopy, isLoggedIn]);

  React.useEffect(() => {
    const ws = new WebSocket(WSS_URL);
    setStateWs(ws);
    ws.onopen = async () => {
      console.log("connected to ws");
    };
    ws.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.action === WssActions.WssInfo && data.success) {
        dispatch(initWs(ws));
      }
      // Receive a message from the server
      // console.log(e);
    };
    // ws.onerror = (e) => {
    //   // An error occurred
    //   console.log(e.message);
    // };
    ws.onclose = (e) => {
      // Connection closed
      // console.log(e.code, e.reason);
      dispatch(resetWs());
    };
  }, []);

  React.useEffect(() => {
    if (stateWs && stateWs.readyState === 1 && !isLogged) {
      let message = createWssMessage(WssActions.Logout);
      console.log(message);
    }
  }, [stateWs, isLogged]);

  if (isLoading) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.primary[900],
        },
      }}
    >
      {isLoggedIn ? (
        <Stack.Group>
          <Stack.Screen
            name="Root"
            component={TopTabNavigator}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="UserProfileStack"
            component={UserProfileStack}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="EditProfileStack"
            component={EditProfileStack}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="UserSettingsStack"
            component={UserSettingsStack}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="SnapSyncStack"
            component={SnapSyncStack}
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;
