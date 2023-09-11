import { KeyboardAvoidingView, TextInput } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import { useMutation } from "react-query";
import { AuthValidateUsername } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import Logo from "@/components/AuthStack/Logo/Logo";
import Form from "@/components/AuthStack/Form/Form";
import { Input } from "native-base";
import { AuthStyles } from "../styles";
import { PlaceholderColor } from "@/constants/Layout";
import BottomButton from "@/components/AuthStack/BottomButton/BottomButton";
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from "./costants";

const AuthInsertUsername = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertUsername">) => {
  const { userData } = route.params;

  // REFS
  const inputRef = React.useRef<TextInput>(null);

  // HOOKS

  // MUTATIONS
  const mutation = useMutation(
    (data: { username: string; sessionId: string }) =>
      AuthValidateUsername(data.username, data.sessionId),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthChooseProfilePicture", {
          userData: {
            ...userData,
            username: userData.username.trim().toLocaleLowerCase(),
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

  // STATES

  // EFFECTS
  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      e.preventDefault(); // Non lo faccio uscire dalla pagina
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  // FUNCTIONS
  const handleChangedText = (text: string) => {
    if (!userData) return;

    navigation.setParams({
      userData: {
        ...userData,
        username: text.trim(),
      },
    });
  };

  const handlePressContinue = () => {
    if (!userData.username.trim()) {
      return;
    }
    if (userData.username.trim().length < MIN_USERNAME_LENGTH) {
      return;
    }

    if (userData.username.trim().length > MAX_USERNAME_LENGTH) {
      return;
    }

    mutation.mutate({
      username: userData.username.toLocaleLowerCase().trim(),
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
        <Logo title="It's almost there , choose your username" />

        <Form>
          <Input
            ref={inputRef}
            style={AuthStyles.input}
            placeholder="Username"
            placeholderTextColor={PlaceholderColor}
            variant="unstyled"
            value={userData.username}
            onChangeText={handleChangedText}
            isDisabled={mutation.isLoading}
            maxLength={MAX_USERNAME_LENGTH}
          />
        </Form>

        <BottomButton
          label="Continue"
          onPress={handlePressContinue}
          isLoading={mutation.isLoading}
          disabled={
            !userData || userData.username.trim().length < MIN_USERNAME_LENGTH
          }
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertUsername;
