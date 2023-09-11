import { AuthDto } from "@/models/dto/Auth";
import AuthChooseProfilePicture from "@/screens/AuthStack/AuthChooseProfilePicture/AuthChooseProfilePicture";
import AuthInsertDateOfBirth from "@/screens/AuthStack/AuthInsertDateOfBirth/AuthInsertDateOfBirth";
import AuthInsertFullName from "@/screens/AuthStack/AuthInsertFullName/AuthInsertFullName";
import AuthInsertOtp from "@/screens/AuthStack/AuthInsertOtp/AuthInsertOtp";
import AuthInsertPhoneNumber from "@/screens/AuthStack/AuthInsertPhoneNumber/AuthInsertPhoneNumber";
import AuthInsertUsername from "@/screens/AuthStack/AuthInsertUsername/AuthInsertUsername";
import { AuthStackParamList } from "@/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
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
