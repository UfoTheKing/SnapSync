import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import PhoneInput from "react-native-phone-input";
import { useMutation } from "react-query";
import { AuthValidatePhoneNumber } from "@/api/routes/auth";
import Container from "@/components/Container";
import { Button } from "native-base";
import { authStyles } from "./AuthInsertFullName";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {};

const AuthInsertPhoneNumber = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertPhoneNumber">) => {
  const { userData } = route.params;

  const insets = useSafeAreaInsets();

  const phoneInputRef = React.useRef<PhoneInput>(null);

  const validatePhoneNumberMutation = useMutation(
    (data: { phoneNumber: string; sessionId: string }) =>
      AuthValidatePhoneNumber(data.phoneNumber, data.sessionId),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthInsertOtp", {
          userData: {
            ...userData,
          },
          subtitle: data.message,
        });
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          alert(error.message);
        }
      },
    }
  );

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
        }}
      >
        <View style={authStyles.containerLogo}>
          <Text>{userData.sessionId}</Text>
        </View>
        <Text style={authStyles.containerTitle}>
          It's almost there! Create your account using your phone number
        </Text>

        <View style={authStyles.formContainer}>
          <PhoneInput
            ref={phoneInputRef}
            initialCountry={userData.phoneNumberCountry?.iso}
            textProps={{
              placeholder: "Phone Number...",
              placeholderTextColor: "#c7c7c7",
              ...authStyles.formInput,
            }}
            onChangePhoneNumber={(phoneNumber) => {
              navigation.setParams({
                userData: {
                  ...userData,
                  phoneNumber: phoneNumber,
                },
              });
            }}
            initialValue={userData.phoneNumber}
            disabled={validatePhoneNumberMutation.isLoading}
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
            isLoading={validatePhoneNumberMutation.isLoading}
            onPress={() => {
              if (!userData.phoneNumber.trim()) {
                console.log("No phone number", userData.phoneNumber);
                return;
              }

              validatePhoneNumberMutation.mutate({
                phoneNumber: userData.phoneNumber.trim(),
                sessionId: userData.sessionId,
              });
            }}
          >
            <Text
              style={{
                ...authStyles.buttonText,
              }}
            >
              Continue
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertPhoneNumber;

const styles = StyleSheet.create({});
