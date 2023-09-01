import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserProfileStackParamList } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import UserProfileSceen from "@/screens/UserProfile/UserProfileSceen";

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
        component={UserProfileSceen}
        initialParams={{
          fromHome: true,
          userId: user!.id,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserProfileStack;
