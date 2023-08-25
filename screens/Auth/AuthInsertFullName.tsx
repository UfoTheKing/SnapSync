import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import Container from "@/components/Container";
import { LightBackground } from "@/utils/theme";
import { Button, Input, Spinner } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthStackScreenProps } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "react-query";
import { AuthGetSessionId, AuthValidateFullName } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {};

const AuthInsertFullName = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertFullName">) => {
  const { userData } = route.params;

  const insets = useSafeAreaInsets();

  const inputRef = React.useRef<TextInput>(null);

  const validateFullNameMutation = useMutation(
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
        if (error && instanceOfErrorResponseType(error)) {
          alert(error.message);
        }
      },
    }
  );

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

  React.useEffect(() => {
    if (data) {
      navigation.setParams({
        userData: {
          ...userData,
          sessionId: data.sessionId,
        },
      });
    }
  }, [data, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

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
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {error && instanceOfErrorResponseType(error)
            ? error.message
            : "Something went wrong"}
        </Text>
      </Container>
    );
  }

  return (
    <Container dismissKeyboardEnabled safeAreaTop={true}>
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
          Get Started, what is your name?
        </Text>

        <View style={authStyles.formContainer}>
          <Input
            ref={inputRef}
            style={authStyles.formInput}
            placeholder="Full Name"
            placeholderTextColor="#c7c7c7"
            variant="unstyled"
            value={userData.fullName}
            onChangeText={(text) => {
              navigation.setParams({
                userData: {
                  ...userData,
                  fullName: text,
                },
              });
            }}
            isDisabled={validateFullNameMutation.isLoading}
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
            disabled={userData.fullName.trim().length < 2}
            isLoading={validateFullNameMutation.isLoading}
            onPress={() => {
              if (!userData.fullName.trim()) {
                return;
              }

              validateFullNameMutation.mutate({
                fullName: userData.fullName.trim(),
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

export default AuthInsertFullName;

export const authStyles = StyleSheet.create({
  containerLogo: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  containerTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
  containerSubTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "gray",
    textAlign: "center",
    marginTop: 5,
  },

  formContainer: {
    maxWidth: 400,
    width: "100%",
    paddingHorizontal: 20,
    // paddingVertical: 20,
  },
  formInput: {
    height: 75,
    fontSize: 25,
    textAlign: "left",
    fontWeight: "bold",
    backgroundColor: LightBackground,
  },

  buttonContainer: {
    width: "100%",
    maxWidth: 400,
    position: "absolute",
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 20,
    height: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
