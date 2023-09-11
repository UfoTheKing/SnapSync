import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { UserProfileStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { FetchUserProfileById } from "@/api/routes/user";
import {
  AcceptFriendship,
  DeleteFriendship,
  RejectFriendship,
  ShowFriendship,
} from "@/api/routes/friendship";
import { useFocusEffect } from "@react-navigation/native";
import GoBackButton, { GO_BACK_BUTTON_DARK } from "@/components/GoBackButton";
import { Skeleton, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { LightBackground } from "@/utils/theme";
import Biography from "@/components/UserProfile/Biography/Biography";
import Friendship from "@/components/UserProfile/Friendship";
import { instanceOfErrorResponseType } from "@/api/client";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "@/components/BottomSheetModal/CustomBackdrop";
import BottomSheetModalItem from "@/components/BottomSheetModal/BottomSheetModalItem";
import { BiographyEntity } from "@/models/project/UserProfile";
import Counter from "../../components/UserProfile/Counter/Counter";
import MutualFriends from "@/components/UserProfile/MutualFriends/MutualFriends";
import { AuthLogOut } from "@/api/routes/auth";
import {
  getAuthToken,
  removeAuthToken,
} from "@/business/secure-store/AuthToken";
import { resetWs } from "@/business/redux/features/socket/socketSlice";
import { logout } from "@/business/redux/features/user/userSlice";
import AntDesignButton from "@/components/AntDesignButton";
import { AntDesign } from "@expo/vector-icons";

type Props = {};

const UserProfileSceen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"UserProfile">) => {
  const { fromHome, userId, username = "", profilePictureUrl } = route.params;

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);

  const queryClient = useQueryClient();

  const colors = useTheme().colors;

  const dispatch = useDispatch();

  const { dismissAll } = useBottomSheetModal();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetModalOtherUserRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = React.useCallback(
    (props: any) => (
      <CustomBackdrop
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
  const renderBackdropOtherUser = React.useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalPressOtherUser}
      />
    ),
    []
  );

  const acceptFriendRequestMutation = useMutation(
    (userId: number) => AcceptFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        friendshipsStatusRefetch();
        queryClient.invalidateQueries(["user", user!.id, "friends", tokenApi]);
        queryClient.removeQueries(["user", user!.id, "friends", tokenApi], {
          exact: true,
        });

        queryClient.invalidateQueries(["user", "incoming_requests", tokenApi]);
        queryClient.removeQueries(["user", "incoming_requests", tokenApi], {
          exact: true,
        });
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          // console.log(error.message);
        }
      },
    }
  );

  const rejectFriendRequestMutation = useMutation(
    (userId: number) => RejectFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        friendshipsStatusRefetch();
        queryClient.invalidateQueries(["user", "incoming_requests", tokenApi]);
        queryClient.removeQueries(["user", "incoming_requests", tokenApi], {
          exact: true,
        });
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          // console.log(error.message);
        }
      },
    }
  );

  const destroyFriendshipMutation = useMutation(
    (userId: number) => DeleteFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        friendshipsStatusRefetch();
        queryClient.invalidateQueries(["user", user!.id, "friends", tokenApi]);
        queryClient.removeQueries(["user", user!.id, "friends", tokenApi], {
          exact: true,
        });

        queryClient.invalidateQueries(["user", "incoming_requests", tokenApi]);
        queryClient.removeQueries(["user", "incoming_requests", tokenApi], {
          exact: true,
        });

        queryClient.invalidateQueries(["user", "outgoing_requests", tokenApi]);
        queryClient.removeQueries(["user", "outgoing_requests", tokenApi], {
          exact: true,
        });
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          // console.log(error.message);
        }
      },
    }
  );

  const logOutMutation = useMutation(() => AuthLogOut(tokenApi), {
    onSuccess: (data) => {
      console.log("logout success");
      clearGlobalCache();
    },
    onError: (error) => {},
  });

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

  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: LightBackground,
      },
      headerLeft: () => (
        <GoBackButton
          onPress={() => {
            if (fromHome) {
              navigation.navigate("Root", {
                screen: "TabHomeStack",
              });
            } else navigation.goBack();
          }}
        />
      ),
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              lineHeight: 28,
              marginRight: 4,
            }}
          >
            {userProfile
              ? userProfile.username.length > 25
                ? userProfile.username.slice(0, 25) + "..."
                : userProfile.username
              : username
              ? username.length > 25
                ? username.slice(0, 25) + "..."
                : username
              : ""}
          </Text>
          {userProfile && userProfile.isVerified && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.primary[900]}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
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
            {friendshipsStatus ? (
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
            ) : null}
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

  const clearGlobalCache = async () => {
    const authTokenBefore = await getAuthToken();
    console.log("clearing global cache b", authTokenBefore);
    await removeAuthToken();
    const authTokenAfter = await getAuthToken();
    console.log("clearing global cache a", authTokenAfter);

    queryClient.clear();

    dispatch(resetWs());
    dispatch(logout());
  };

  if (userProfileIsError) {
    return (
      <Container>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={userProfileIsRefetching}
              onRefresh={() => {
                userProfileRefetch();
                friendshipsStatusRefetch();
              }}
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "bold" }}>
            {userProfileError && instanceOfErrorResponseType(userProfileError)
              ? userProfileError.message
              : "An error occured"}
          </Text>
        </ScrollView>
      </Container>
    );
  }

  // console.log(JSON.stringify(userProfile, null, 2));

  const handlePressEntity = (entity: BiographyEntity) => {
    if (entity.type === "user") {
      navigation.push("UserProfile", {
        userId: entity.id,
        fromHome: false,
        username: entity.text,
      });
    }
  };

  return (
    <Container safeAreaTop={false}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={userProfileIsRefetching}
            onRefresh={() => {
              userProfileRefetch();
              // friendshipsStatusRefetch();
            }}
          />
        }
      >
        <View style={styles.headerContainer}>
          {userProfileIsLoading || userProfileIsError || !userProfile ? (
            profilePictureUrl ? (
              <Image
                source={{ uri: profilePictureUrl }}
                style={styles.avatar}
              />
            ) : user && user.id === userId ? (
              <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.avatar}
              />
            ) : (
              <Skeleton width={100} height={100} rounded="full" />
            )
          ) : (
            <Image
              source={{ uri: userProfile.profilePictureUrl }}
              style={styles.avatar}
            />
          )}
          <View style={styles.fullNameContainer}>
            {userProfileIsLoading ? (
              <Skeleton width={200} height={5} rounded={5} />
            ) : (
              <Text style={styles.fullName}>{userProfile?.fullName}</Text>
            )}
          </View>
          <View style={styles.bioContainer}>
            <Biography
              bio={userProfile?.biography || null}
              onPressEntity={handlePressEntity}
            />
          </View>
          <Counter
            friends={userProfile?.friendsCount || 0}
            snaps={userProfile?.snapsCount || 0}
            onPressFriends={() => {
              if (userProfile) {
                navigation.push("FriendsList", {
                  userId: userProfile.id,
                  username: userProfile.username,
                  isVerified: userProfile.isVerified,
                });
              }
            }}
            disabledFriends={
              userProfile && friendshipsStatus
                ? userProfile.isMyProfile ||
                  friendshipsStatus.isBlocking ||
                  (userProfile.isPrivate && !friendshipsStatus.isFriend)
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
        <View style={styles.snapsContainer}>
          {friendshipsStatus &&
          userProfile &&
          !userProfile.isMyProfile &&
          (friendshipsStatus.isBlocking ||
            (userProfile.isPrivate && !friendshipsStatus.isFriend)) ? (
            <View style={styles.privateAndBlockedContainer}>
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
        </View>
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
              />
              <BottomSheetModalItem
                label="Edit profile"
                onPress={() => {}}
                bottomDivider
              />
              <BottomSheetModalItem
                label="Log out"
                onPress={() => logOutMutation.mutate()}
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
                />
                <BottomSheetModalItem label="Block" onPress={() => {}} />
              </View>
            </BottomSheetModal>
          </>
        )
      ) : null}
    </Container>
  );
};

export default UserProfileSceen;

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 8,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fullNameContainer: {
    marginTop: 8,
  },
  fullName: {
    fontWeight: "bold",
    fontSize: 18,
    lineHeight: 24,
  },
  bioContainer: {
    marginTop: 8,
  },

  snapsContainer: {
    // backgroundColor: "blue",
  },
  privateAndBlockedContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
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
    letterSpacing: 1,
  },
  textSubtitle: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  },
});
