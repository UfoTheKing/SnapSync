import { StyleSheet } from "react-native";
import React from "react";
import { ILoginResponse } from "@/models/auth/Auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/types";
import { useTheme } from "native-base";
import TopTabNavigator from "./TopTabNavigator";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import OnboardingScreen from "@/screens/Root/OnboardingScreen";
import AuthStack from "./AuthStack";

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
