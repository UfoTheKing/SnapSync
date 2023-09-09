import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import {
  AcceptFriendship,
  DeleteFriendship,
  FetchIncomingFriendRequests,
} from "@/api/routes/friendship";
import { instanceOfErrorResponseType } from "@/api/client";
import Container from "@/components/Container";
import InlineUser from "@/components/InlineUser";
import { LightBackground } from "@/utils/theme";
import { FlashList } from "@shopify/flash-list";
import { Button, Divider, Spinner, useTheme } from "native-base";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeight } from "@/constants/Layout";
import { SmallUser } from "@/models/resources/User";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";

type Props = {
  onPressOutgoingRequests?: () => void;
  onPressUsername?: (user: SmallUser) => void;
};

const PendingRoute = (props: Props) => {
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);

  const colors = useTheme().colors;

  const queryClient = useQueryClient();

  const acceptFriendRequestMutation = useMutation(
    (userId: number) => AcceptFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
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

  const destroyFriendshipMutation = useMutation(
    (userId: number) => DeleteFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          // console.log(error.message);
        }
      },
    }
  );

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
    error,
  } = useInfiniteQuery(
    ["user", "incoming_requests", tokenApi],
    ({ pageParam = 1 }) =>
      FetchIncomingFriendRequests(tokenApi, pageParam, 10, null),
    {
      enabled: isLoggedIn,
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.hasMore) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
      keepPreviousData: true,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchInterval: false,
      refetchIntervalInBackground: false,
    }
  );

  const handlePressDestroyFriendship = (username: string, userId: number) => {
    Alert.alert(
      "Delete Request",
      `Are you sure you want to delete your friend request from ${username}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            destroyFriendshipMutation.mutate(userId);
          },
        },
      ]
    );
  };

  return (
    <Container
      safeAreaTop={false}
      safeAreaBottom={false}
      safeAreaLeft={false}
      safeAreaRight={false}
    >
      <FlashList
        ListHeaderComponent={
          <TouchableOpacity onPress={() => props.onPressOutgoingRequests?.()}>
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Request Sent
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: "gray",
                  }}
                >
                  People who have sent you a friend request
                </Text>
              </View>
              <Entypo name="chevron-right" size={24} color="black" />
            </View>
          </TouchableOpacity>
        }
        data={
          data && data.pages && data.pages.length > 0
            ? data.pages
                .map((page) =>
                  page.pendingRequests ? page.pendingRequests : []
                )
                .flat()
            : []
        }
        renderItem={({ item }) => {
          return (
            <InlineUser
              onPress={() => props.onPressUsername?.(item.user)}
              key={item.user.id}
              username={item.user.username}
              fullName={item.user.fullName}
              profilePictureUrl={item.user.profilePictureUrl}
              isVerified={item.user.isVerified}
              ph={15}
              contact={item.user.isContact}
              showContact={true}
              rightComponent={
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    height: INLINE_USER_HEIGHT,
                    flex: 1,
                  }}
                >
                  <Button
                    colorScheme="primary"
                    size="sm"
                    rounded="full"
                    isLoading={
                      (acceptFriendRequestMutation.isLoading &&
                        acceptFriendRequestMutation.variables ===
                          item.user.id) ||
                      (destroyFriendshipMutation.isLoading &&
                        destroyFriendshipMutation.variables === item.user.id)
                    }
                    onPress={() =>
                      acceptFriendRequestMutation.mutate(item.user.id)
                    }
                  >
                    Accept
                  </Button>
                  <TouchableOpacity
                    onPress={() =>
                      handlePressDestroyFriendship(
                        item.user.username,
                        item.user.id
                      )
                    }
                    style={{
                      marginLeft: 5,
                    }}
                    disabled={
                      (acceptFriendRequestMutation.isLoading &&
                        acceptFriendRequestMutation.variables ===
                          item.user.id) ||
                      (destroyFriendshipMutation.isLoading &&
                        destroyFriendshipMutation.variables === item.user.id)
                    }
                  >
                    <AntDesign name="close" size={24} color={colors.red[500]} />
                  </TouchableOpacity>
                </View>
              }
            />
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        estimatedItemSize={INLINE_USER_HEIGHT}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? <Spinner size="sm" /> : undefined
        }
        ItemSeparatorComponent={() => <Divider my={2} />}
        onRefresh={() => refetch()}
        refreshing={isRefetching}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: ScreenHeight - 200,
            }}
          >
            {isLoading ? (
              <Spinner size="lg" />
            ) : isError ? (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {error && instanceOfErrorResponseType(error)
                  ? error.message
                  : "An error occured"}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                No pending requests
              </Text>
            )}
          </View>
        }
      />
    </Container>
  );
};

export default PendingRoute;

const styles = StyleSheet.create({});
