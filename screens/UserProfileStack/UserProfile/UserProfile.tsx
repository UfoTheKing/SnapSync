import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import React, { useMemo, useRef } from "react";
import { UserProfileStackScreenProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useQuery, useQueryClient } from "react-query";
import { Skeleton, useTheme } from "native-base";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { ShowFriendship } from "@/api/routes/friendship";
import { useFocusEffect } from "@react-navigation/native";
import { FetchUserProfileById } from "@/api/routes/user";
import { LightBackground } from "@/utils/theme";
import GoBackButton from "@/components/GoBackButton";
import Verified from "@/components/User/Verified";
import AntDesignButton from "@/components/AntDesignButton";
import Container from "@/components/Container";
import Biography from "@/components/UserProfile/Biography/Biography";
import { BiographyEntity } from "@/models/project/UserProfile";
import Counter from "@/components/UserProfile/Counter/Counter";
import MutualFriends from "@/components/UserProfile/MutualFriends/MutualFriends";
import ErrorText from "@/components/ErrorText";
import { AntDesign } from "@expo/vector-icons";

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

  // MUTATIONS

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
        <View style={styles.header}>
          <Text style={styles.headerUsername}>
            {renderHeaderUsernameText()}
          </Text>
          {userProfile && userProfile.isVerified && <Verified />}
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
                  // handlePresentModalPress();
                } else {
                  // handlePresentModalPressOtherUser();
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
  const renderHeaderUsernameText = () => {
    if (userProfile) {
      if (userProfile.username.length > 25) {
        return userProfile.username.slice(0, 25) + "...";
      } else {
        return userProfile.username;
      }
    } else if (username) {
      if (username.length > 25) {
        return username.slice(0, 25) + "...";
      } else {
        return username;
      }
    }

    return "";
  };

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
      navigation.push("FriendsList", {
        userId: userProfile.id,
        username: userProfile.username,
        isVerified: userProfile.isVerified,
      });
    }
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
            friends={userProfile?.friendsCount || 0}
            snaps={userProfile?.snapsCount || 0}
            onPressFriends={handlePressFriends}
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

        {userProfileIsError ? (
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ErrorText error={userProfileError} />
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
