import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SearchStackParamList } from "@/types";
import SearchScreen from "@/screens/Tabs/Search/SearchScreen";
import OutgoingRequestsScreen from "@/screens/Tabs/Search/OutgoingRequestsScreen";

const Stack = createNativeStackNavigator<SearchStackParamList>();

const TabSearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: false,
      })}
      initialRouteName="Search"
    >
      <Stack.Screen name="Search" component={SearchScreen} />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="OutgoingRequests"
          component={OutgoingRequestsScreen}
          options={{
            headerShown: true,
            headerBackVisible: false,
            headerTitle: "Requests Sent",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default TabSearchStack;
