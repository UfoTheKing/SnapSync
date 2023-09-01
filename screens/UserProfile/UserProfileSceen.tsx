import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { UserProfileStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { FetchUserProfileById } from "@/api/routes/user";
import {
  AcceptFriendship,
  DeleteFriendship,
  RejectFriendship,
  ShowFriendship,
} from "@/api/routes/friendship";
import { useFocusEffect } from "@react-navigation/native";
import GoBackButton from "@/components/GoBackButton";
import { Skeleton, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { LightBackground } from "@/utils/theme";
import Biography from "@/components/UserProfile/Biography";
import Friendship from "@/components/UserProfile/Friendship";
import { instanceOfErrorResponseType } from "@/api/client";

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

  const {
    data: userProfile,
    error: userProfileError,
    isLoading: userProfileIsLoading,
    isError: userProfileIsError,
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

  const {
    data: friendshipsStatus,
    error: friendshipsStatusError,
    isLoading: friendshipsStatusIsLoading,
    isError: friendshipsStatusIsError,
    refetch: friendshipsStatusRefetch,
    isRefetching: friendshipsStatusIsRefetching,
  } = useQuery(
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, marginRight: 4 }}>
            {userProfile ? userProfile.username : username}
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
    });
  }, [userProfile, navigation, username, fromHome]);

  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn && userProfile && !userProfile.isMyProfile) {
        friendshipsStatusRefetch();
      }
    }, [userProfile])
  );

  if (userProfileIsError) {
    return (
      <Container textCenter>
        <Text style={{ fontSize: 12, fontWeight: "bold" }}>
          {userProfileError && instanceOfErrorResponseType(userProfileError)
            ? userProfileError.message
            : "An error occured"}
        </Text>
      </Container>
    );
  }

  return (
    <Container safeAreaTop={false}>
      <View style={styles.headerContainer}>
        {userProfileIsLoading || userProfileIsError || !userProfile ? (
          profilePictureUrl ? (
            <Image source={{ uri: profilePictureUrl }} style={styles.avatar} />
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
            onPressEntity={(entity) => {}}
          />
        </View>
        {userProfile ? (
          !userProfile.isMyProfile ? (
            <Friendship
              friendshipStatus={friendshipsStatus}
              isLoading={friendshipsStatusIsLoading}
              isRefetching={friendshipsStatusIsRefetching}
              fullName={userProfile.fullName}
              accept={() => {
                acceptFriendRequestMutation.mutate(userProfile.id);
              }}
              reject={() => {
                rejectFriendRequestMutation.mutate(userProfile.id);
              }}
              destroy={() => {
                destroyFriendshipMutation.mutate(userProfile.id);
              }}
            />
          ) : null
        ) : null}
      </View>
    </Container>
  );
};

export default UserProfileSceen;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    marginTop: 8,
    alignItems: "center",
    // backgroundColor: "red",
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
    fontSize: 16,
  },
  bioContainer: {
    marginTop: 8,
  },
});
