import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { EditProfileStackScreenProps } from "@/types";
import GoBackButton from "@/components/GoBackButton";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import { FormControl, Input, Spinner, useTheme } from "native-base";
import { PlaceholderColor } from "@/constants/Layout";
import { EditProfileStyles } from "../styles";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChangeUsername, FetchUsernameRules } from "@/api/routes/accounts";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import FormContainer from "@/components/Forms/FormContainer/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { changeUsername } from "@/business/redux/features/user/userSlice";
import { validateField } from "@/utils/validation";
import { useFormik } from "formik";
import { RootStyles } from "@/screens/RootStack/styles";

const EditProfileUsername = ({
  navigation,
  route,
}: EditProfileStackScreenProps<"EditProfileUsername">) => {
  const { username } = route.params;

  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  // REFS
  const inputRef = React.useRef<TextInput>(null);

  // HOOKS
  const queryClient = useQueryClient();
  const colors = useTheme().colors;
  const formik = useFormik({
    initialValues: {
      username: username,
    },
    onSubmit: (values) => {
      mutation.mutate(values.username.toLocaleLowerCase().trim());
    },
  });

  // MUTATIONS
  const mutation = useMutation(
    (username: string) => ChangeUsername(username, tokenApi),
    {
      onSuccess(data) {
        if (user) {
          dispatch(changeUsername(data.username));
          queryClient.refetchQueries(["user", user.id, "profile", tokenApi]);
        }

        navigation.goBack();
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
    ["username", "rules"],
    () => FetchUsernameRules(),
    {
      refetchOnWindowFocus: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );

  // STATES

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <GoBackButton
          onPress={() => navigation.goBack()}
          disabled={mutation.isLoading}
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          disabled={mutation.isLoading || !formik.dirty}
          onPress={handlePressSave}
        >
          {mutation.isLoading ? (
            <Spinner size="sm" />
          ) : (
            <Text
              style={{
                color: colors.primary[900],
                fontWeight: "500",
                fontSize: 12,
                opacity: formik.dirty ? 1 : 0.5,
              }}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, mutation.isLoading, formik.dirty]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (mutation.isLoading) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        return;
      } else {
        navigation.dispatch(e.data.action);
      }
    });
  }, [navigation, mutation.isLoading]);

  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, [])
  );

  // FUNCTIONS
  const handleChangedText = (text: string) => {
    if (data && data.rules && data.rules.maxLength) {
      if (text.length > data.rules.maxLength) {
        return;
      }
    }

    formik.setFieldValue("username", text);
  };

  const handlePressSave = async () => {
    if (!data) return;

    let isValid = await validateField(
      formik.values.username.trim(),
      data.rules
    );
    if (!isValid) {
      return;
    }

    formik.submitForm();

    // mutation.mutate(username.toLocaleLowerCase().trim());
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
        <ErrorHandler error={error} />
      </Container>
    );
  }

  return (
    <Container dismissKeyboardEnabled>
      <View style={styles.container}>
        <FormContainer>
          <FormControl>
            <FormControl.Label>
              <Text style={EditProfileStyles.label}>Username</Text>
            </FormControl.Label>
            <Input
              ref={inputRef}
              style={EditProfileStyles.input}
              placeholderTextColor={PlaceholderColor}
              variant="filled"
              value={formik.values.username}
              onChangeText={handleChangedText}
              // isDisabled={mutation.isLoading}
              maxLength={data.rules.maxLength}
              rounded="full"
              isDisabled={mutation.isLoading}
            />
          </FormControl>
        </FormContainer>

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 20,
          }}
        >
          <Text style={EditProfileStyles.helpText}>
            In most cases, you will be able to return to your previous username
            for another 30 days.
          </Text>
        </View>
      </View>
    </Container>
  );
};

export default EditProfileUsername;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
