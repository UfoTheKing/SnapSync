import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/types";
import Search from "@/screens/TabSearchStack/Search/Search";
import { RootStyles } from "@/screens/RootStack/styles";
import OutgoingRequests from "@/screens/TabSearchStack/OutgoingRequests/OutgoingRequests";

const Stack = createNativeStackNavigator<SearchStackParamList>();

const TabSearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}
      initialRouteName="Search"
    >
      <Stack.Screen name="Search" component={Search} />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="OutgoingRequests"
          component={OutgoingRequests}
          options={{
            headerShown: true,
            headerShadowVisible: false,
            headerBackVisible: false,
            headerTitle: "Outgoing Requests",
            headerTitleAlign: "center",
            headerTitleStyle: {
              ...RootStyles.headerTitleStyle,
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default TabSearchStack;
