import { KeyboardAvoidingView, StyleSheet, TextInput } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import {
  AuthGetCountryFromIp,
  AuthGetSessionId,
  AuthValidateFullName,
} from "@/api/routes/auth";
import { useMutation, useQuery } from "react-query";
import Container from "@/components/Container";
import { Input, Spinner } from "native-base";
import ErrorText from "@/components/ErrorText";
import { useFocusEffect } from "@react-navigation/native";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import Logo from "@/components/AuthStack/Logo/Logo";
import BottomButton from "@/components/AuthStack/BottomButton/BottomButton";
import Form from "@/components/AuthStack/Form/Form";
import { PlaceholderColor } from "@/constants/Layout";
import { AuthStyles } from "../styles";
import { MAX_FULLNAME_LENGTH, MIN_FULLNAME_LENGTH } from "./costants";

const AuthInsertFullName = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertFullName">) => {
  const { userData } = route.params;

  // REFS
  const inputRef = React.useRef<TextInput>(null);

  // MUTATIONS
  const mutation = useMutation(
    (data: { fullName: string; sessionId: string }) =>
      AuthValidateFullName(data.fullName, data.sessionId),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthInsertDateOfBirth", {
          userData: {
            ...userData,
            fullName: userData.fullName.trim(),
          },
        });
      },
      onError: (error) => {
        let message = "Something went wrong";
        if (error && instanceOfErrorResponseType(error))
          message = error.message;

        Toast.show({
          type: "error",
          text1: message,
          position: "bottom",
        });
      },
    }
  );

  // QUERIES
  const { data, isLoading, isError, error } = useQuery(
    "SessionId",
    () => AuthGetSessionId(),
    {
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );

  const { data: countryFromIp } = useQuery("CountryFromIp", () =>
    AuthGetCountryFromIp()
  );

  // STATE

  // EFFECTS
  React.useEffect(() => {
    if (data) {
      navigation.setParams({
        userData: {
          ...userData,
          sessionId: data.sessionId,
          phoneNumberCountry: countryFromIp?.country || undefined,
        },
      });
    }
  }, [data, navigation, countryFromIp]);

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  // FUNCTIONS
  const handlePress = () => {
    if (!userData) return;
    if (!userData.sessionId) return;

    if (!userData.fullName.trim()) return;

    mutation.mutate({
      fullName: userData.fullName.trim(),
      sessionId: userData.sessionId,
    });
  };

  const handleChangedText = (text: string) => {
    if (!userData) return;

    navigation.setParams({
      userData: {
        ...userData,
        fullName: text.trimStart(),
      },
    });
  };

  if (isLoading) {
    return (
      <Container textCenter>
        <Spinner size="sm" />
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container textCenter>
        <ErrorText error={error} />
      </Container>
    );
  }

  return (
    <Container dismissKeyboardEnabled>
      <KeyboardAvoidingView
        behavior={"height"}
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Logo title="Get Started, what is your name?" />

        <Form>
          <Input
            ref={inputRef}
            style={AuthStyles.input}
            placeholder="Name"
            placeholderTextColor={PlaceholderColor}
            variant="unstyled"
            value={userData.fullName}
            onChangeText={handleChangedText}
            isDisabled={mutation.isLoading}
            maxLength={MAX_FULLNAME_LENGTH}
          />
        </Form>

        <BottomButton
          label="Continue"
          isLoading={mutation.isLoading}
          disabled={userData.fullName.trim().length < MIN_FULLNAME_LENGTH}
          onPress={handlePress}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertFullName;

const styles = StyleSheet.create({});
