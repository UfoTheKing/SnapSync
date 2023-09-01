import React from "react";
import Container from "@/components/Container";
import { AuthStackScreenProps } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAvoidingView, View, Text, TextInput } from "react-native";
import { authStyles } from "./AuthInsertFullName";
import { Button, Input } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import { AuthValidateUsername } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {};

const AuthInsertUsername = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertUsername">) => {
  const { userData } = route.params;
  const inputRef = React.useRef<TextInput>(null);

  const insets = useSafeAreaInsets();

  const validateUsernameMutation = useMutation(
    (data: { username: string; sessionId: string }) =>
      AuthValidateUsername(data.username, data.sessionId),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthChooseProfilePicture", {
          userData: {
            ...userData,
            username: userData.username.toLocaleLowerCase().trim(),
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

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Non lo faccio uscire dalla pagina
    });
  }, [navigation]);

  const onChangeUsername = (text: string) => {
    navigation.setParams({
      userData: {
        ...userData,
        username: text.toLocaleLowerCase().trim(),
      },
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

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
          It's almost there , choose your username
        </Text>

        <View style={authStyles.formContainer}>
          <Input
            ref={inputRef}
            style={authStyles.formInput}
            placeholder="Username"
            placeholderTextColor="#c7c7c7"
            variant="unstyled"
            value={userData.username}
            onChangeText={onChangeUsername}
            isDisabled={validateUsernameMutation.isLoading}
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
            disabled={userData.username.trim().length < 3}
            isLoading={validateUsernameMutation.isLoading}
            onPress={() => {
              if (!userData.username.trim()) {
                return;
              }

              validateUsernameMutation.mutate({
                username: userData.username.toLocaleLowerCase().trim(),
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

export default AuthInsertUsername;
