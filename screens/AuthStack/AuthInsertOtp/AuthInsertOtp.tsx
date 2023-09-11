import { KeyboardAvoidingView, TextInput } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import useCountdown from "@bradgarropy/use-countdown";
import { useMutation } from "react-query";
import { AuthResendOtp, AuthValidateOtp } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { ILoginResponse } from "@/models/auth/Auth";
import { storeAuthToken } from "@/business/secure-store/AuthToken";
import { storeDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { login } from "@/business/redux/features/user/userSlice";
import BottomButton from "@/components/AuthStack/BottomButton/BottomButton";
import Container from "@/components/Container";
import { OTP_LENGTH } from "./costants";
import Logo from "@/components/AuthStack/Logo/Logo";
import { Input } from "native-base";
import Form from "@/components/AuthStack/Form/Form";
import { AuthStyles } from "../styles";
import { PlaceholderColor } from "@/constants/Layout";
import { useFocusEffect } from "@react-navigation/native";

const AuthInsertOtp = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertOtp">) => {
  const { userData } = route.params;

  // REDUX
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  // REFS
  const inputRef = React.useRef<TextInput>(null);

  // HOOKS
  const countdown = useCountdown({
    minutes: 1,
    seconds: 0,
    format: "mm:ss",
    autoStart: true,
    onCompleted: () => setTimerEnd(true),
  });

  // MUTATIONS
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
          await handleLogin(data.data);
        }
      },
      onError: (error) => {
        let message = "Something went wrong";
        if (error && instanceOfErrorResponseType(error)) {
          message = error.message;
        }

        Toast.show({
          type: "error",
          text1: message,
          position: "bottom",
        });
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
    }
  );

  // QUERIES

  // STATE
  const [timerEnd, setTimerEnd] = React.useState(false);

  // EFFECTS
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

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  // FUNCTIONS
  const handleLogin = async (data?: ILoginResponse) => {
    // L'utente con questo phoneNumber esiste, quindi lo mando alla pagina Home
    if (data) {
      await storeAuthToken(data.accessToken);
      await storeDeviceUuid(data.device.uuid);
      dispatch(login(data));
    }
  };

  const handleChange = (text: string) => {
    if (!userData) return;
    if (userData.sessionId.length === 0) return;

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

    if (newPin.length === OTP_LENGTH) {
      validateOtpMutation.mutate({
        otp: newPin,
        sessionId: userData.sessionId,
      });
    }
  };

  const handlePressResend = () => {
    if (!timerEnd) return;

    resendOtpMutation.mutate({
      sessionId: userData.sessionId,
    });
  };

  return (
    <Container dismissKeyboardEnabled>
      <KeyboardAvoidingView
        behavior={"height"}
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Logo title={`Insert the code sent to ${userData.phoneNumber}`} />

        <Form>
          <Input
            ref={inputRef}
            style={{
              ...AuthStyles.input,
              textAlign: "center",
            }}
            maxLength={OTP_LENGTH}
            placeholder={"• • • • • •"}
            placeholderTextColor={PlaceholderColor}
            variant="unstyled"
            value={userData.phoneNumberVerificationCode}
            keyboardType="number-pad"
            onChangeText={handleChange}
            isDisabled={validateOtpMutation.isLoading}
          />
        </Form>

        <BottomButton
          label={
            timerEnd
              ? "Resend"
              : `Resend in ${countdown.minutes}:${countdown.seconds}`
          }
          helpText={"Change phone number"}
          isLoading={
            validateOtpMutation.isLoading || resendOtpMutation.isLoading
          }
          disabled={
            validateOtpMutation.isLoading ||
            !timerEnd ||
            resendOtpMutation.isLoading
          }
          onPress={handlePressResend}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertOtp;
