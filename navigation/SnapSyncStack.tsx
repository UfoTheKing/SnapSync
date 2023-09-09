import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SnapSyncStackParamList } from "@/types";
import InviteScreen from "@/screens/SnapSync/InviteScreen";
import SnapSyncScreen from "@/screens/SnapSync/SnapSyncScreen";

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
        name="SnapSync"
        component={SnapSyncScreen}
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
