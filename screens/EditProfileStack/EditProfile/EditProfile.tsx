import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useQuery } from "react-query";
import { FetchWebFormData } from "@/api/routes/accounts";
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

const EditProfile = ({
  navigation,
}: EditProfileStackScreenProps<"EditProfile">) => {
  // REDUX
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  // HOOKS
  const insets = useSafeAreaInsets();
  const colors = useTheme().colors;
  const { dismissAll } = useBottomSheetModal();

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
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) refetch();
    }, [isLoggedIn])
  );

  // FUNCTIONS

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
            },
          ]}
          onPress={handlePresentModalPress}
        >
          <Ionicons name="pencil" size={16} color={colors.primary[900]} />
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
              navigation.navigate("EditProfileProfilePictureChooseFromLibrary");
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
