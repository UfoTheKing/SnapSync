import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { AuthStackScreenProps } from "@/types";
import { QueryClient, useMutation, useQuery } from "react-query";
import { AuthValidateDateOfBirth } from "@/api/routes/auth";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import { Button, Input } from "native-base";
import { instanceOfErrorResponseType } from "@/api/client";
import { authStyles } from "./AuthInsertFullName";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

const AuthInsertDateOfBirth = ({
  navigation,
  route,
}: AuthStackScreenProps<"AuthInsertDateOfBirth">) => {
  const { userData } = route.params;

  const insets = useSafeAreaInsets();

  const queryClient = new QueryClient();

  const textInputMonth = React.useRef<TextInput>(null);
  const textInputDay = React.useRef<TextInput>(null);
  const textInputYear = React.useRef<TextInput>(null);

  const validateDateOfBirthMutation = useMutation(
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

  useFocusEffect(
    React.useCallback(() => {
      textInputMonth.current?.focus();
    }, [])
  );

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

  return (
    <Container dismissKeyboardEnabled>
      <KeyboardAvoidingView
        behavior={"height"}
        style={{
          flex: 1,
        }}
      >
        <View style={authStyles.containerLogo}></View>
        <Text style={authStyles.containerTitle}>
          Hi {userData.fullName}, when is your birthday?
        </Text>

        <View style={authStyles.formContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View
              style={{
                ...styles.container,
                flex: 1,
              }}
            >
              <Input
                ref={textInputMonth}
                placeholder="MM"
                variant="unstyled"
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={2}
                style={[
                  authStyles.formInput,
                  {
                    textAlign: "center",
                  },
                ]}
                placeholderTextColor="#c7c7c7"
                value={userData.monthOfBirth?.toString()}
                onChangeText={onChangeMonthOfBirth}
                isDisabled={validateDateOfBirthMutation.isLoading}
              />
            </View>
            <Text style={styles.slash}>/</Text>
            <View
              style={{
                ...styles.container,
                flex: 1,
              }}
            >
              <Input
                ref={textInputDay}
                placeholder="DD"
                variant="unstyled"
                keyboardType="number-pad"
                maxLength={2}
                style={[
                  authStyles.formInput,
                  {
                    textAlign: "center",
                  },
                ]}
                placeholderTextColor="#c7c7c7"
                value={userData.dayOfBirth?.toString()}
                onChangeText={onChangeDayOfBirth}
                isDisabled={validateDateOfBirthMutation.isLoading}
              />
            </View>
            <Text style={styles.slash}>/</Text>
            <View
              style={{
                ...styles.container,
                flex: 2,
              }}
            >
              <Input
                ref={textInputYear}
                placeholder="YYYY"
                variant="unstyled"
                keyboardType="number-pad"
                maxLength={4}
                style={[
                  authStyles.formInput,
                  {
                    textAlign: "center",
                  },
                ]}
                placeholderTextColor="#c7c7c7"
                value={userData.yearOfBirth?.toString()}
                onChangeText={onChangeYearOfBirth}
                isDisabled={validateDateOfBirthMutation.isLoading}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            ...authStyles.buttonContainer,
            bottom: insets.bottom,
          }}
        >
          <Text style={styles.helpText}>
            We use this data to make sure you're old enough to use our app.
          </Text>
          <Button
            style={authStyles.button}
            isLoading={validateDateOfBirthMutation.isLoading}
            onPress={() => {
              if (
                !userData.yearOfBirth ||
                !userData.monthOfBirth ||
                !userData.dayOfBirth
              ) {
                return;
              }

              validateDateOfBirthMutation.mutate({
                yearOfBirth: userData.yearOfBirth,
                monthOfBirth: userData.monthOfBirth,
                dayOfBirth: userData.dayOfBirth,
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

export default AuthInsertDateOfBirth;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    padding: 5,
  },
  slash: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#c7c7c7",
  },
  helpText: {
    fontSize: 12,
    fontWeight: "normal",
    color: "#000",
    marginBottom: 10,
  },
});
