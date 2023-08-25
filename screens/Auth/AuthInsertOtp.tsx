import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { Button, Input } from "native-base";
import { useMutation } from "react-query";
import { AuthValidateOtp } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { authStyles } from "./AuthInsertFullName";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { login } from "@/business/redux/features/user/userSlice";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";

const pinLength = 6;

type Props = {};

const AuthInsertOtp = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertOtp">) => {
  const { userData, subtitle } = route.params;

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const dispatch = useDispatch();

  const insets = useSafeAreaInsets();

  const [resendTimer, setResendTimer] = React.useState(60);

  const validateOtpMutation = useMutation(
    (data: { otp: string; sessionId: string }) =>
      AuthValidateOtp(data.otp, data.sessionId),
    {
      onSuccess: async (data) => {
        if (data.goNext) {
          // L'utente con questo phoneNumber non esiste, quindi lo mando a registrarsi
          navigation.navigate("AuthInsertUsername", {
            userData: {
              ...userData,
            },
          });
        } else {
          // L'utente con questo phoneNumber esiste, quindi lo mando alla pagina Home
          if (data.data) {
            // Faccio il login
            await storeAuthToken(data.data.accessToken);
            await storeDeviceUuid(data.data.device.uuid);
            dispatch(login(data.data));
          }
        }
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          alert(error.message);
        }
      },
    }
  );

  React.useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("Root", {
        screen: "TabHomeStack",
      });
    }
  }, [isLoggedIn]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Non lo faccio uscire dalla pagina
      return;
    });
  }, [navigation]);

  // Creo un timer per il resend
  React.useEffect(() => {
    if (resendTimer > 0) {
      setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 2000);
    }
  }, [resendTimer]);

  return (
    <Container dismissKeyboardEnabled>
      <KeyboardAvoidingView
        behavior={"height"}
        style={{
          flex: 1,
        }}
      >
        <View style={authStyles.containerLogo}>
          <Text>{userData.sessionId}</Text>
        </View>
        <Text style={authStyles.containerTitle}>
          Insert the code we sent to {userData.phoneNumber}
        </Text>
        <View
          style={{
            ...authStyles.formContainer,
          }}
        >
          <Input
            style={{
              ...authStyles.formInput,
              textAlign: "center",
            }}
            maxLength={pinLength}
            placeholder="• • • • • •"
            placeholderTextColor="#c7c7c7"
            variant="unstyled"
            value={userData.phoneNumberVerificationCode}
            keyboardType="number-pad"
            onChangeText={(text) => {
              let newPin = text;
              if (isNaN(Number(newPin))) {
                navigation.setParams({
                  userData: {
                    ...userData,
                    phoneNumberVerificationCode: "",
                  },
                });
                return;
              }

              navigation.setParams({
                userData: {
                  ...userData,
                  phoneNumberVerificationCode: newPin,
                },
              });

              if (newPin.length === pinLength) {
                validateOtpMutation.mutate({
                  otp: newPin,
                  sessionId: userData.sessionId,
                });
              }
            }}
            isDisabled={validateOtpMutation.isLoading}
          />
        </View>
        <View
          style={{
            ...authStyles.buttonContainer,
            bottom: insets.bottom,
          }}
        >
          <Button
            style={authStyles.button}
            disabled={resendTimer > 0}
            isLoading={validateOtpMutation.isLoading}
            onPress={() => {
              console.log("resend");
            }}
          >
            <Text
              style={{
                ...authStyles.buttonText,
              }}
            >
              {resendTimer > 0
                ? "Resend in " + resendTimer + " seconds"
                : "Resend"}
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertOtp;

const styles = StyleSheet.create({});
