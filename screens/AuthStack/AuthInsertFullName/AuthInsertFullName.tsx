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
import { useFocusEffect } from "@react-navigation/native";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import Logo from "@/components/Auth/Logo/Logo";
import BottomButton from "@/components/Auth/BottomButton/BottomButton";
import { PlaceholderColor } from "@/constants/Layout";
import { AuthStyles } from "../styles";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import FormContainer from "@/components/Forms/FormContainer/FormContainer";
import { FetchFullNameRules } from "@/api/routes/accounts";

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

  const {
    data: rules,
    isLoading: isLoadingRules,
    isError: isErrorRules,
    error: errorRules,
  } = useQuery(["fullName", "rules"], () => FetchFullNameRules(), {
    retry: 3,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

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

  if (isLoading || isLoadingRules) {
    return (
      <Container textCenter>
        <Spinner size="sm" />
      </Container>
    );
  }

  if (isError || isErrorRules) {
    return (
      <Container textCenter>
        <ErrorHandler error={isError ? error : errorRules} />
      </Container>
    );
  }

  if (!data || !rules) {
    return (
      <Container textCenter>
        <ErrorHandler error={isError ? error : errorRules} />
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

        <FormContainer>
          <Input
            ref={inputRef}
            style={AuthStyles.input}
            placeholder="Name"
            placeholderTextColor={PlaceholderColor}
            variant="unstyled"
            value={userData.fullName}
            onChangeText={handleChangedText}
            isDisabled={mutation.isLoading}
            maxLength={rules.rules.maxLength}
          />
        </FormContainer>

        <BottomButton
          label="Continue"
          isLoading={mutation.isLoading}
          disabled={
            rules.rules.minLength
              ? userData.fullName.length < rules.rules.minLength
              : rules.rules.maxLength
              ? userData.fullName.length > rules.rules.maxLength
              : false
          }
          onPress={handlePress}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertFullName;

const styles = StyleSheet.create({});
