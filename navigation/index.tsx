import { StyleSheet } from "react-native";
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

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loginAuthToken = async () => {
      if (data && !isLoggedIn) {
        dispatch(login(data));

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    loginAuthToken();
  }, [data, isLoggedIn]);

  React.useEffect(() => {
    const ws = new WebSocket(WSS_URL);
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
          {/* <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{
              headerShown: false,
            }}
          /> */}
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

const styles = StyleSheet.create({});
