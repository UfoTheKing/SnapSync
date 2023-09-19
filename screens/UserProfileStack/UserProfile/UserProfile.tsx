import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { UserProfileStackScreenProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Skeleton, useTheme } from "native-base";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { ShowFriendship } from "@/api/routes/friendship";
import { useFocusEffect } from "@react-navigation/native";
import { FetchUserProfileById } from "@/api/routes/user";
import { LightBackground } from "@/utils/theme";
import GoBackButton from "@/components/GoBackButton";
import AntDesignButton from "@/components/AntDesignButton";
import Container from "@/components/Container";
import Biography from "@/components/UserProfile/Biography/Biography";
import { BiographyEntity } from "@/models/project/UserProfile";
import Counter from "@/components/UserProfile/Counter/Counter";
import MutualFriends from "@/components/UserProfile/MutualFriends/MutualFriends";
import { AntDesign } from "@expo/vector-icons";
import { AuthLogOut } from "@/api/routes/auth";
import { removeAuthToken } from "@/business/secure-store/AuthToken";
import { logoutWs } from "@/business/redux/features/socket/socketSlice";
import { logout } from "@/business/redux/features/user/userSlice";
import BottomSheetModalItem from "@/components/BottomSheetModal/BottomSheetModalItem/BottomSheetModalItem";
import BottomSheetModalCustomBackdrop from "@/components/BottomSheetModal/BottomSheetModalCustomBackdrop/BottomSheetModalCustomBackdrop";
import { Ionicons } from "@expo/vector-icons";
import HeaderUsername from "@/components/UserProfile/HeaderUsername/HeaderUsername";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";

const UserProfile = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"UserProfile">) => {
  const { fromHome, userId, username = "", profilePictureUrl } = route.params;

  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  // REFS
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalOtherUserRef = useRef<BottomSheetModal>(null);

  // HOOKS
  const queryClient = useQueryClient();
  const colors = useTheme().colors;
  const { dismissAll } = useBottomSheetModal();

  // MEMOS
  const snapPoints = useMemo(() => ["50%", "80%"], []);

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

  const handlePresentModalPressOtherUser = useCallback(() => {
    bottomSheetModalOtherUserRef.current?.present();
  }, []);
  const handleDismissModalPressOtherUser = useCallback(() => {
    bottomSheetModalOtherUserRef.current?.dismiss();
  }, []);
  const renderBackdropOtherUser = useCallback(
    (props: any) => (
      <BottomSheetModalCustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalPressOtherUser}
      />
    ),
    []
  );

  // MUTATIONS
  const logOutMutation = useMutation(() => AuthLogOut(tokenApi), {
    onSuccess: (data) => {
      clearGlobalCache();
    },
    onError: (error) => {},
  });

  // QUERIES
  const {
    data: userProfile,
    error: userProfileError,
    isLoading: userProfileIsLoading,
    isError: userProfileIsError,
    refetch: userProfileRefetch,
    isRefetching: userProfileIsRefetching,
  } = useQuery(
    ["user", userId, "profile", tokenApi],
    () => FetchUserProfileById(userId, tokenApi),
    {
      enabled: isLoggedIn,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      retry: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
    }
  );

  const { data: friendshipsStatus, refetch: friendshipsStatusRefetch } =
    useQuery(
      ["user", userId, "friendships", tokenApi],
      () => ShowFriendship(userId, tokenApi),
      {
        enabled: false,
      }
    );

  // STATES

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: LightBackground,
      },
      headerLeft: () => {
        if (fromHome) return null;

        return (
          <GoBackButton
            onPress={() => {
              if (fromHome) {
                navigation.navigate("Root", {
                  screen: "TabHomeStack",
                });
              } else navigation.goBack();
            }}
          />
        );
      },
      headerTitle: () => (
        <HeaderUsername userProfile={userProfile} username={username} />
      ),
      headerTitleAlign: "center",
      headerRight: () => {
        if (!userProfile) return null;

        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {friendshipsStatus ? (
              <TouchableOpacity style={{ marginRight: 8 }}>
                {friendshipsStatus.isBlocking ? (
                  <Ionicons
                    name="lock-closed"
                    size={24}
                    color={colors.primary[900]}
                  />
                ) : friendshipsStatus.isFriend ? (
                  <Ionicons
                    name="people"
                    size={24}
                    color={colors.primary[900]}
                  />
                ) : friendshipsStatus.incomingRequest ? (
                  <Ionicons
                    name="person-add"
                    size={24}
                    color={colors.primary[900]}
                  />
                ) : friendshipsStatus.outgoingRequest ? (
                  <Ionicons
                    name="person-add-outline"
                    size={24}
                    color={colors.primary[900]}
                  />
                ) : null}
              </TouchableOpacity>
            ) : null} */}
            <AntDesignButton
              onPress={() => {
                dismissAll();
                if (userProfile.isMyProfile) {
                  handlePresentModalPress();
                } else {
                  handlePresentModalPressOtherUser();
                }
              }}
              name="ellipsis1"
            />
          </View>
        );
      },
    });
  }, [userProfile, navigation, username, fromHome, friendshipsStatus]);

  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn && userProfile && !userProfile.isMyProfile) {
        friendshipsStatusRefetch();
      }
    }, [userProfile])
  );

  // FUNCTIONS
  const handlePressEntity = (entity: BiographyEntity) => {
    if (entity.type === "user") {
      navigation.push("UserProfile", {
        userId: entity.id,
        fromHome: false,
        username: entity.text,
      });
    }
  };

  const handlePressFriends = () => {
    if (userProfile) {
      navigation.push("MutualFriends", {
        userId: userProfile.id,
        username: userProfile.username,
        isVerified: userProfile.isVerified,
      });
    }
  };

  const clearGlobalCache = async () => {
    await removeAuthToken();

    queryClient.clear();

    dispatch(logoutWs());
    dispatch(logout());
  };

  return (
    <Container safeAreaTop={false}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={userProfileIsRefetching}
            onRefresh={userProfileRefetch}
          />
        }
      >
        <View style={styles.userProfileHeader}>
          {userProfile ? (
            <Image
              source={{ uri: userProfile.profilePictureUrl }}
              style={styles.avatar}
            />
          ) : profilePictureUrl ? (
            <Image source={{ uri: profilePictureUrl }} style={styles.avatar} />
          ) : userProfileIsLoading ? (
            <Skeleton width={100} height={100} rounded="full" />
          ) : null}
          {userProfileIsLoading ? (
            <Skeleton width={200} height={5} rounded={5} marginTop={8} />
          ) : (
            <Text style={styles.fullName}>{userProfile?.fullName}</Text>
          )}
          <View style={{ marginTop: 8 }}>
            <Biography
              bio={userProfile?.biography || null}
              onPressEntity={handlePressEntity}
            />
          </View>

          <Counter
            isMyProfile={userProfile?.isMyProfile}
            friendsCount={userProfile?.friendsCount}
            mutualFriendsCount={userProfile?.mutualFriends?.count}
            snapsCount={userProfile?.snapsCount}
            onPressFriends={handlePressFriends}
            disabledFriends={
              userProfile && friendshipsStatus
                ? userProfile.isMyProfile
                  ? true
                  : (userProfile.isPrivate && !friendshipsStatus.isFriend) ||
                    friendshipsStatus.isBlocking
                  ? true
                  : false
                : true
            }
          />

          <MutualFriends
            mutualFriends={userProfile?.mutualFriends}
            username={userProfile?.username}
          />
        </View>

        {userProfileIsError ? (
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ErrorHandler error={userProfileError} />
          </View>
        ) : friendshipsStatus &&
          userProfile &&
          !userProfile.isMyProfile &&
          (friendshipsStatus.isBlocking ||
            (userProfile.isPrivate && !friendshipsStatus.isFriend)) ? (
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.circleIcon}>
              <AntDesign name="lock" size={32} color="black" />
            </View>
            <Text style={styles.textTitle}>
              {friendshipsStatus.isBlocking
                ? "User blocked"
                : "This account is private"}
            </Text>
            <Text
              style={[
                styles.textSubtitle,
                {
                  color: colors.gray[500],
                },
              ]}
            >
              {friendshipsStatus.isBlocking
                ? "You can't see this user's snaps"
                : `You and ${userProfile.username} must be friends to see their snaps`}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {userProfile ? (
        userProfile.isMyProfile ? (
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
          >
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <BottomSheetModalItem
                label="Settings and privacy"
                onPress={() => {}}
                bottomDivider
                icon={<Ionicons name="settings" size={16} color="black" />}
              />
              <BottomSheetModalItem
                label="Edit profile"
                onPress={() => {
                  dismissAll();
                  navigation.navigate("EditProfileStack", {
                    screen: "EditProfile",
                  });
                }}
                bottomDivider
                icon={<Ionicons name="pencil" size={16} color="black" />}
              />
              <BottomSheetModalItem
                label="Log out"
                onPress={() => logOutMutation.mutate()}
                icon={<Ionicons name="log-out" size={16} color="black" />}
              />
            </View>
          </BottomSheetModal>
        ) : (
          <>
            <BottomSheetModal
              ref={bottomSheetModalOtherUserRef}
              index={0}
              snapPoints={snapPoints}
              backdropComponent={renderBackdropOtherUser}
            >
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <BottomSheetModalItem
                  label="Report"
                  onPress={() => {}}
                  bottomDivider
                  icon={
                    <Ionicons name="alert-circle" size={16} color="black" />
                  }
                />
                <BottomSheetModalItem
                  label="Block"
                  onPress={() => {}}
                  icon={<Ionicons name="lock-closed" size={16} color="black" />}
                />
              </View>
            </BottomSheetModal>
          </>
        )
      ) : null}
    </Container>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerUsername: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 28,
    marginRight: 4,
  },

  userProfileHeader: {
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fullName: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 24,
    marginTop: 8,
  },
  circleIcon: {
    width: 75,
    height: 75,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#c2c2c2",
    borderWidth: 1,
    marginBottom: 8,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: "#000",
  },
  textSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});
