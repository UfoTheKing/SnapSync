import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import { useMutation } from "react-query";
import { AuthValidateDateOfBirth } from "@/api/routes/auth";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import Logo from "@/components/Auth/Logo/Logo";
import { Input } from "native-base";
import { AuthStyles } from "../styles";
import { PlaceholderColor } from "@/constants/Layout";
import BottomButton from "@/components/Auth/BottomButton/BottomButton";
import FormContainer from "@/components/Forms/FormContainer/FormContainer";

const AuthInsertDateOfBirth = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertDateOfBirth">) => {
  const { userData } = route.params;

  // REFS
  const textInputMonth = React.useRef<TextInput>(null);
  const textInputDay = React.useRef<TextInput>(null);
  const textInputYear = React.useRef<TextInput>(null);

  // MUTATIONS
  const mutation = useMutation(
    (data: {
      yearOfBirth: number;
      monthOfBirth: number;
      dayOfBirth: number;
      sessionId: string;
    }) =>
      AuthValidateDateOfBirth(
        data.yearOfBirth,
        data.monthOfBirth,
        data.dayOfBirth,
        data.sessionId
      ),
    {
      onSuccess: (data) => {
        navigation.navigate("AuthInsertPhoneNumber", {
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

  useFocusEffect(
    React.useCallback(() => {
      textInputMonth.current?.focus();
    }, [])
  );

  // FUNCTIONS
  const onChangeYearOfBirth = (text: string) => {
    if (text.length > 4) return;
    if (isNaN(parseInt(text))) {
      navigation.setParams({
        userData: {
          ...userData,
          yearOfBirth: null,
        },
      });

      textInputDay.current?.focus();

      return;
    }
    navigation.setParams({
      userData: {
        ...userData,
        yearOfBirth: text.length === 0 ? null : parseInt(text),
      },
    });
  };

  const onChangeMonthOfBirth = (text: string) => {
    if (text.length > 2) return;
    if (isNaN(parseInt(text))) {
      navigation.setParams({
        userData: {
          ...userData,
          monthOfBirth: null,
        },
      });

      // textInputDay.current?.focus();

      return;
    }
    navigation.setParams({
      userData: {
        ...userData,
        monthOfBirth: text.length === 0 ? null : parseInt(text),
      },
    });

    // Se l'utente ha inserito 2 numeri, allora si passa al giorno
    if (text.length === 2) {
      textInputDay.current?.focus();
    }
  };

  const onChangeDayOfBirth = (text: string) => {
    if (text.length > 2) return;
    if (isNaN(parseInt(text))) {
      navigation.setParams({
        userData: {
          ...userData,
          dayOfBirth: null,
        },
      });

      textInputMonth.current?.focus();

      return;
    }
    navigation.setParams({
      userData: {
        ...userData,
        dayOfBirth: text.length === 0 ? null : parseInt(text),
      },
    });

    // Se l'utente ha inserito 2 numeri, allora si passa al giorno
    if (text.length === 2) {
      textInputYear.current?.focus();
    }
  };

  const handlePressContinue = () => {
    if (
      !userData.yearOfBirth ||
      !userData.monthOfBirth ||
      !userData.dayOfBirth
    ) {
      return;
    }
    if (userData.sessionId.length === 0) {
      return;
    }

    mutation.mutate({
      yearOfBirth: userData.yearOfBirth,
      monthOfBirth: userData.monthOfBirth,
      dayOfBirth: userData.dayOfBirth,
      sessionId: userData.sessionId,
    });
  };

  return (
    <Container dismissKeyboardEnabled>
      <KeyboardAvoidingView
        behavior={"padding"}
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Logo title={`Hi ${userData.fullName}, when is your birthday?`} />

        <FormContainer style={styles.form}>
          <View style={styles.container}>
            <Input
              ref={textInputMonth}
              placeholder="MM"
              variant="unstyled"
              keyboardType="number-pad"
              inputMode="numeric"
              maxLength={2}
              style={[
                AuthStyles.input,
                {
                  textAlign: "center",
                },
              ]}
              placeholderTextColor={PlaceholderColor}
              value={userData.monthOfBirth?.toString()}
              onChangeText={onChangeMonthOfBirth}
              isDisabled={mutation.isLoading}
            />
          </View>
          <Text style={styles.slash}>/</Text>
          <View style={styles.container}>
            <Input
              ref={textInputDay}
              placeholder="DD"
              variant="unstyled"
              keyboardType="number-pad"
              maxLength={2}
              style={[
                AuthStyles.input,
                {
                  textAlign: "center",
                },
              ]}
              placeholderTextColor={PlaceholderColor}
              value={userData.dayOfBirth?.toString()}
              onChangeText={onChangeDayOfBirth}
              isDisabled={mutation.isLoading}
            />
          </View>
          <Text style={styles.slash}>/</Text>
          <View
            style={[
              styles.container,
              {
                flex: 2,
              },
            ]}
          >
            <Input
              ref={textInputYear}
              placeholder="YYYY"
              variant="unstyled"
              keyboardType="number-pad"
              maxLength={4}
              style={[
                AuthStyles.input,
                {
                  textAlign: "center",
                },
              ]}
              placeholderTextColor={PlaceholderColor}
              value={userData.yearOfBirth?.toString()}
              onChangeText={onChangeYearOfBirth}
              isDisabled={mutation.isLoading}
            />
          </View>
        </FormContainer>

        <BottomButton
          label="Continue"
          isLoading={mutation.isLoading}
          disabled={
            !userData.yearOfBirth ||
            !userData.monthOfBirth ||
            !userData.dayOfBirth
          }
          helpText="We use this data to make sure you're old enough to use our app."
          disabledHelpText
          onPress={handlePressContinue}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AuthInsertDateOfBirth;

const styles = StyleSheet.create({
  form: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    padding: 5,
    flex: 1,
  },
  slash: {
    fontSize: 25,
    fontWeight: "bold",
    color: PlaceholderColor,
  },
});
