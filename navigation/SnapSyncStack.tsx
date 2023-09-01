import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SnapSyncStackParamList } from "@/types";
import CreateScreen from "@/screens/SnapSync/CreateScreen";
import InviteScreen from "@/screens/SnapSync/InviteScreen";

type Props = {};

const Stack = createNativeStackNavigator<SnapSyncStackParamList>();

const SnapSyncStack = (props: Props) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Create"
        component={CreateScreen}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Invite" component={InviteScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default SnapSyncStack;
