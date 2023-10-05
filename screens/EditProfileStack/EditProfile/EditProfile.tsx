import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ChangeProfilePicture, FetchWebFormData } from "@/api/routes/accounts";
import { useFocusEffect } from "@react-navigation/native";
import Container from "@/components/Container";
import { Spinner, useTheme } from "native-base";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import Avatar from "@/components/User/Avatar/Avatar";
import { GrayNeutral, ScreenWidth } from "@/constants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EditProfileStackScreenProps } from "@/types";
import GoBackButton from "@/components/GoBackButton";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import BottomSheetModalCustomBackdrop from "@/components/BottomSheetModal/BottomSheetModalCustomBackdrop/BottomSheetModalCustomBackdrop";
import BottomSheetModalItem from "@/components/BottomSheetModal/BottomSheetModalItem/BottomSheetModalItem";
import { RootStyles } from "@/screens/RootStack/styles";
import {
  reset,
  setUriProfilePicture,
} from "@/business/redux/features/editprofile/editProfileSlice";
import * as ImagePicker from "expo-image-picker";
import { instanceOfErrorResponseType } from "@/api/client";
import Toast from "react-native-toast-message";
import { changeProfilePictureUrl } from "@/business/redux/features/user/userSlice";

const EditProfile = ({
  navigation,
}: EditProfileStackScreenProps<"EditProfile">) => {
  // REDUX
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const uriProfilePicture = useSelector(
    (state: RootState) => state.editProfile.uriProfilePicture
  );
  const dispatch = useDispatch();

  // HOOKS
  const insets = useSafeAreaInsets();
  const colors = useTheme().colors;
  const { dismissAll } = useBottomSheetModal();
  const queryClient = useQueryClient();

  // REFS
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // MEMOS
  const snapPoints = useMemo(() => ["30%"], []);

  // CALLBACKS
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetModalCustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalPress}
      />
    ),
    []
  );

  // MUTATIONS
  const mutation = useMutation(
    (uri: string) => ChangeProfilePicture(uri, tokenApi),
    {
      onSuccess: (data) => {
        if (user) {
          dispatch(changeProfilePictureUrl(data.profilePictureUrl));
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
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery(
    ["user", "edit", tokenApi],
    () => FetchWebFormData(tokenApi),
    {
      enabled: false,
    }
  );

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
      headerShadowVisible: false,
      headerTitle: "Details",
      headerTitleStyle: {
        ...RootStyles.headerTitleStyle,
      },
      headerTitleAlign: "center",
      headerRight: () => {
        // if (!uriProfilePicture) return null;

        return (
          <TouchableOpacity
            // disabled={mutation.isLoading || !formik.dirty}
            onPress={handlePressEnd}
          >
            {mutation.isLoading ? (
              <Spinner size="sm" />
            ) : (
              <Text
                style={{
                  color: colors.primary[900],
                  fontWeight: "500",
                  fontSize: 12,
                }}
              >
                End
              </Text>
            )}
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, mutation.isLoading, uriProfilePicture]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      dismissAll();
      dispatch(reset());
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) refetch();
    }, [isLoggedIn])
  );

  // FUNCTIONS
  const handlePressEnd = () => {
    if (uriProfilePicture) {
      // Prima di tornare indietro, aggiorno il profilo con la nuova foto
      mutation.mutate(uriProfilePicture);
    } else {
      navigation.goBack();
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      dispatch(setUriProfilePicture(uri));
      // setImage(result.assets[0].uri);
    }
  };

  if (isLoading) {
    return (
      <Container textCenter>
        <Spinner size="sm" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container textCenter>
        <ErrorHandler error={error} />
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Container safeAreaTop={false}>
      <View style={styles.top}>
        <Avatar profilePictureUrl={user?.profilePictureUrl} size={75} />
        <TouchableOpacity
          style={[
            styles.avatarEdit,
            {
              right: (ScreenWidth - insets.left - insets.right) / 2 - 45,
              backgroundColor: colors.primary[900],
              borderColor: "#fff",
              borderWidth: 4,
            },
          ]}
          onPress={handlePresentModalPress}
        >
          <Ionicons name="pencil" size={12} color={"white"} />
        </TouchableOpacity>
      </View>
      <View style={[styles.bottom]}>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => {
              navigation.navigate("EditProfileUsername", {
                username: data.formData.username,
              });
            }}
            disabled={isRefetching}
          >
            <View style={styles.bottomInfo}>
              <Text style={styles.itemLabel}>Username</Text>
              <Text style={styles.itemValue}>{data.formData.username}</Text>
            </View>
            <Ionicons name="pencil" size={12} color={colors.primary[900]} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => {
              navigation.navigate("EditProfileFullName", {
                fullName: data.formData.fullName,
              });
            }}
            disabled={isRefetching}
          >
            <View style={styles.bottomInfo}>
              <Text style={styles.itemLabel}>Name</Text>
              <Text style={styles.itemValue}>{data.formData.fullName}</Text>
            </View>
            <Ionicons name="pencil" size={12} color={colors.primary[900]} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.bottomItem}
            onPress={() => {
              navigation.navigate("EditProfileBio", {
                biography: data.formData.biography,
              });
            }}
            disabled={isRefetching}
          >
            <View style={styles.bottomInfo}>
              <Text style={styles.itemLabel}>Biography</Text>
              <Text style={styles.itemValue}>
                {data.formData.biography
                  ? data.formData.biography.length > 25
                    ? data.formData.biography.slice(0, 25) + "..."
                    : data.formData.biography
                  : null}
              </Text>
            </View>
            <Ionicons name="pencil" size={12} color={colors.primary[900]} />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <BottomSheetModalItem
            label="Choose from library"
            onPress={() => {
              dismissAll();
              pickImage();
            }}
            bottomDivider
            icon={<Ionicons name="image" size={16} color="black" />}
          />
          <BottomSheetModalItem
            label="Take photo"
            onPress={() => {
              dismissAll();
              navigation.navigate("EditProfileProfilePictureTakePhoto");
            }}
            icon={<Ionicons name="camera" size={16} color="black" />}
          />
        </View>
      </BottomSheetModal>
    </Container>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  top: {
    flex: 1,
    maxHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEdit: {
    position: "absolute",
    bottom: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  bottom: {
    flex: 1,
  },
  bottomContainer: {
    flex: 1,
    maxHeight: 50,
    marginVertical: 5,
    alignItems: "center",
  },
  bottomItem: {
    width: 316,
    height: 50,
    borderBottomColor: "#D6D6D6",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bottomInfo: {
    flexDirection: "column",
    justifyContent: "center",
  },
  itemLabel: {
    fontWeight: "500",
    color: GrayNeutral,
    fontSize: 12,
    lineHeight: 18,
  },
  itemValue: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#383838",
    marginTop: 2,
  },
});
