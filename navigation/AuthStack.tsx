import { AuthDto } from "@/models/dto/Auth";
import AuthChooseProfilePicture from "@/screens/Auth/AuthChooseProfilePicture";
import AuthInsertDateOfBirth from "@/screens/Auth/AuthInsertDateOfBirth";
import AuthInsertFullName from "@/screens/Auth/AuthInsertFullName";
import AuthInsertOtp from "@/screens/Auth/AuthInsertOtp";
import AuthInsertPhoneNumber from "@/screens/Auth/AuthInsertPhoneNumber";
import AuthInsertUsername from "@/screens/Auth/AuthInsertUsername";
import { AuthStackParamList } from "@/types";
import { LightBackground } from "@/utils/theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<AuthStackParamList>();

type Props = {};

const AuthStack = (props: Props) => {
  const initialParams: AuthDto = {
    sessionId: "",

    fullName: "",
    username: "",
    phoneNumberVerificationCode: "",

    phoneNumber: "",
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: LightBackground,
        },
        gestureEnabled: false,
      }}
    >
      <Stack.Screen
        name="AuthInsertFullName"
        component={AuthInsertFullName}
        initialParams={{
          userData: initialParams,
        }}
      />

      <Stack.Screen
        name="AuthInsertDateOfBirth"
        component={AuthInsertDateOfBirth}
      />

      <Stack.Screen
        name="AuthInsertPhoneNumber"
        component={AuthInsertPhoneNumber}
      />

      <Stack.Screen name="AuthInsertOtp" component={AuthInsertOtp} />

      <Stack.Screen name="AuthInsertUsername" component={AuthInsertUsername} />

      <Stack.Screen
        name="AuthChooseProfilePicture"
        component={AuthChooseProfilePicture}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
