import { RootStyles } from "@/screens/RootStack/styles";
import UserSettings from "@/screens/UserSettingsStack/UserSettings/UserSettings";
import UserSettingsBlockedUsers from "@/screens/UserSettingsStack/UserSettingsBlockedUsers/UserSettingsBlockedUsers";
import { UserSettingsStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<UserSettingsStackParamList>();

const UserSettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
        headerBackVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: {
          ...RootStyles.headerTitleStyle,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="UserSettings"
        component={UserSettings}
        options={{
          title: "Settings",
        }}
      />

      <Stack.Screen
        name="UserSettingsBlockedUsers"
        component={UserSettingsBlockedUsers}
        options={{
          title: "Blocked Users",
        }}
      />
    </Stack.Navigator>
  );
};

export default UserSettingsStack;
