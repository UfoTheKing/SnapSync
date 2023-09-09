import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { Button, Input } from "native-base";
import { useMutation } from "react-query";
import { AuthResendOtp, AuthValidateOtp } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { authStyles } from "./AuthInsertFullName";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { login } from "@/business/redux/features/user/userSlice";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import useCountdown from "@bradgarropy/use-countdown";

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

  const countdown = useCountdown({
    minutes: 1,
    seconds: 0,
    format: "mm:ss",
    autoStart: true,
    onCompleted: () => setTimerEnd(true),
  });

  // For keeping a track on the Timer
  const [timerEnd, setTimerEnd] = React.useState(false);

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

  const resendOtpMutation = useMutation(
    (data: { sessionId: string }) => AuthResendOtp(data.sessionId),
    {
      onSuccess: () => {
        countdown.reset();
        setTimerEnd(false);
      },
      onError: (error) => {},
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

  return (
    <Container dismissKeyboardEnabled>
      <KeyboardAvoidingView
        behavior={"height"}
        style={{
          flex: 1,
          alignItems: "center",
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
          <TouchableOpacity
            onPress={() => {
              // TODO: Forzare il cambio del numero di telefono
            }}
          >
            <Text style={styles.helpText}>Change phone number</Text>
          </TouchableOpacity>
          <Button
            style={{
              ...authStyles.button,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={
              validateOtpMutation.isLoading ||
              !timerEnd ||
              resendOtpMutation.isLoading
            }
            isLoading={
              validateOtpMutation.isLoading || resendOtpMutation.isLoading
            }
            onPress={() => {
              resendOtpMutation.mutate({
                sessionId: userData.sessionId,
              });
              // refTimer.current?.restart();
            }}
          >
            <Text
              style={{
                ...authStyles.buttonText,
              }}
            >
              {timerEnd
                ? "Resend"
                : `Resend in ${countdown.minutes}:${countdown.seconds}`}
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertOtp;

const styles = StyleSheet.create({
  helpText: {
    fontSize: 8,
    fontWeight: "normal",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
});
