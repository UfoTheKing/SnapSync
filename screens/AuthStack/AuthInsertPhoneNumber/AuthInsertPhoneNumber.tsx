import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import PhoneInput from "react-native-phone-input";
import { useMutation } from "react-query";
import { AuthValidatePhoneNumber } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import Container from "@/components/Container";
import Logo from "@/components/AuthStack/Logo/Logo";
import Form from "@/components/AuthStack/Form/Form";
import BottomButton from "@/components/AuthStack/BottomButton/BottomButton";
import { PlaceholderColor } from "@/constants/Layout";
import { AuthStyles } from "../styles";

const AuthInsertPhoneNumber = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertPhoneNumber">) => {
  const { userData } = route.params;

  // REFS
  const phoneInputRef = React.useRef<PhoneInput>(null);

  // MUTATIONS
  const mutation = useMutation(
    (data: { phoneNumber: string; sessionId: string }) =>
      AuthValidatePhoneNumber(data.phoneNumber, data.sessionId),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthInsertOtp", {
          userData: {
            ...userData,
          },
        });
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

  // QUERIES

  // STATE

  // EFFECTS
  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Non lo faccio uscire dalla pagina
      return;
    });
  }, [navigation]);

  // FUNCTIONS
  const handlePressContinue = () => {
    if (!userData) return;
    if (userData.sessionId.length === 0) return;

    if (!phoneInputRef.current?.isValidNumber()) {
      Toast.show({
        type: "error",
        text1: "Invalid phone number",
        position: "bottom",
      });
      return;
    }

    mutation.mutate({
      phoneNumber: phoneInputRef.current.getValue(),
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
        <Logo title="It's almost there! Create your account using your phone number" />

        <Form>
          <PhoneInput
            ref={phoneInputRef}
            initialCountry={userData.phoneNumberCountry?.iso}
            textProps={{
              placeholder: "Phone Number...",
              placeholderTextColor: PlaceholderColor,
              ...AuthStyles.input,
            }}
            onChangePhoneNumber={(phoneNumber) => {
              navigation.setParams({
                userData: {
                  ...userData,
                  phoneNumber: phoneNumber,
                },
              });
            }}
            initialValue={userData.phoneNumberCountry?.phoneCode?.toString()}
            disabled={mutation.isLoading}
          />
        </Form>

        <BottomButton
          label="Continue"
          isLoading={mutation.isLoading}
          disabled={!phoneInputRef.current?.isValidNumber()}
          onPress={handlePressContinue}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertPhoneNumber;

const styles = StyleSheet.create({});
