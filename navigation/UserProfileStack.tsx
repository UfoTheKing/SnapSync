import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProfileStackParamList } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import FriendsListScreen from "@/screens/UserProfile/FriendsListScreen";
import UserProfile from "@/screens/UserProfileStack/UserProfile/UserProfile";

type Props = {};

const Stack = createNativeStackNavigator<UserProfileStackParamList>();

const UserProfileStack = (props: Props) => {
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

      <Stack.Screen name="FriendsList" component={FriendsListScreen} />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
