import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProfileStackParamList } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import UserProfile from "@/screens/UserProfileStack/UserProfile/UserProfile";
import MutualFriends from "@/screens/UserProfileStack/MutualFriends/MutualFriends";

const Stack = createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStack = () => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        initialParams={{
          fromHome: true,
          userId: user!.id,
        }}
      />

      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="MutualFriends" component={MutualFriends} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default UserProfileStack;
