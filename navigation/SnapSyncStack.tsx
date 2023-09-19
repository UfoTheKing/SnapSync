import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SnapSyncStackParamList } from "@/types";
import SnapSync from "@/screens/SnapSyncStack/SnapSync/SnapSync";
import TakeSnap from "@/screens/SnapSyncStack/TakeSnap/TakeSnap";
import PublishSnap from "@/screens/SnapSyncStack/PublishSnap/PublishSnap";

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
        component={SnapSync}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="TakeSnap"
        component={TakeSnap}
        options={{
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="PublishSnap"
        component={PublishSnap}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default SnapSyncStack;
