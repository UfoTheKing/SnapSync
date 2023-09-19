import { KeyboardAvoidingView, TextInput } from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import { useMutation, useQuery } from "react-query";
import { AuthValidateUsername } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import Logo from "@/components/Auth/Logo/Logo";
import { Input, Spinner } from "native-base";
import { AuthStyles } from "../styles";
import { PlaceholderColor } from "@/constants/Layout";
import BottomButton from "@/components/Auth/BottomButton/BottomButton";
import { FetchUsernameRules } from "@/api/routes/accounts";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import FormContainer from "@/components/Forms/FormContainer/FormContainer";

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
  const {
    data: rules,
    isLoading: isLoadingRules,
    isError: isErrorRules,
    error: errorRules,
  } = useQuery(["username", "rules"], () => FetchUsernameRules(), {
    retry: 3,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

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
    if (!userData) return;
    if (!rules) return;

    if (!userData.username.trim()) {
      return;
    }

    if (rules.rules.maxLength) {
      if (userData.username.trim().length > rules.rules.maxLength) {
        return;
      }
    }

    if (rules.rules.minLength) {
      if (userData.username.trim().length < rules.rules.minLength) {
        return;
      }
    }

    mutation.mutate({
      username: userData.username.toLocaleLowerCase().trim(),
      sessionId: userData.sessionId,
    });
  };

  if (isLoadingRules) {
    return (
      <Container textCenter>
        <Spinner size="sm" />
      </Container>
    );
  }

  if (isErrorRules || !rules) {
    return (
      <Container textCenter>
        <ErrorHandler error={errorRules} />
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
        <Logo title="It's almost there , choose your username" />

        <FormContainer>
          <Input
            ref={inputRef}
            style={AuthStyles.input}
            placeholder="Username"
            placeholderTextColor={PlaceholderColor}
            variant="unstyled"
            value={userData.username}
            onChangeText={handleChangedText}
            isDisabled={mutation.isLoading}
            maxLength={rules.rules.maxLength}
          />
        </FormContainer>

        <BottomButton
          label="Continue"
          onPress={handlePressContinue}
          isLoading={mutation.isLoading}
          disabled={
            rules.rules.minLength
              ? userData.username.length < rules.rules.minLength
              : rules.rules.maxLength
              ? userData.username.length > rules.rules.maxLength
              : false
          }
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertUsername;
