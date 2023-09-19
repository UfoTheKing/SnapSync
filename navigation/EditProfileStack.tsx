import EditProfile from "@/screens/EditProfileStack/EditProfile/EditProfile";
import EditProfileBio from "@/screens/EditProfileStack/EditProfileBio/EditProfileBio";
import EditProfileFullName from "@/screens/EditProfileStack/EditProfileFullName/EditProfileFullName";
import EditProfileUsername from "@/screens/EditProfileStack/EditProfileUsername/EditProfileUsername";
import { RootStyles } from "@/screens/RootStack/styles";
import { EditProfileStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<EditProfileStackParamList>();

const EditProfileStack = () => {
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
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: "Details",
        }}
      />

      <Stack.Screen
        name="EditProfileUsername"
        component={EditProfileUsername}
        options={{ headerTitle: "Username" }}
      />

      <Stack.Screen
        name="EditProfileFullName"
        component={EditProfileFullName}
        options={{ headerTitle: "Name" }}
      />

      <Stack.Screen
        name="EditProfileBio"
        component={EditProfileBio}
        options={{ title: "Biography" }}
      />
    </Stack.Navigator>
  );
};

export default EditProfileStack;
