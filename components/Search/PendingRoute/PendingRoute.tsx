import { Alert, TouchableOpacity, View, Text } from "react-native";
import React from "react";
import { SmallUser } from "@/models/resources/User";
import { useFocusEffect } from "@react-navigation/native";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import {
  AcceptFriendship,
  FetchIncomingFriendRequests,
  RejectFriendship,
} from "@/api/routes/friendship";
import Container from "@/components/Container";
import { FlashList } from "@shopify/flash-list";
import Inline from "@/components/User/Inline/Inline";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { Divider, Spinner, useTheme } from "native-base";
import { ScreenHeight } from "@/constants/Layout";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPressUsername?: (user: SmallUser) => void;
  onPressOutgoingRequests?: () => void;
};

const PendingRoute = (props: Props) => {
  const { onPressUsername, onPressOutgoingRequests } = props;

  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // REFS
  const isFirstRender = React.useRef(true);

  // HOOKS
  const colors = useTheme().colors;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  // MUTATIONS
  const acceptFriendRequestMutation = useMutation(
    (userId: number) => AcceptFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
        queryClient.invalidateQueries(["user", "friends", tokenApi]);
        queryClient.removeQueries(["user", "friends", tokenApi], {
          exact: true,
        });

        queryClient.invalidateQueries(["user", "incoming_requests", tokenApi]);
        queryClient.removeQueries(["user", "incoming_requests", tokenApi], {
          exact: true,
        });
      },
    }
  );

  const rejectFriendshipMutation = useMutation(
    (userId: number) => RejectFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
      },
    }
  );

  // QUERIES
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
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

  useFocusEffect(
    React.useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        // console.log("FriendsRoute focused");
      } else {
        // console.log("FriendsRoute refocused");
      }
    }, [])
  );

  // FUNCTIONS
  const handlePressRejectFriendship = (username: string, userId: number) => {
    Alert.alert(
      "Reject friend request",
      `Are you sure you want to reject ${username}'s friend request?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reject",
          onPress: () => {
            rejectFriendshipMutation.mutate(userId);
          },
        },
      ]
    );
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

  return (
    <Container
      safeAreaTop={false}
      safeAreaBottom={false}
      safeAreaLeft={false}
      safeAreaRight={false}
    >
      <FlashList
        data={
          data && data.pages && data.pages.length > 0
            ? data.pages
                .map((page) => (page.requests ? page.requests : []))
                .flat()
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <Inline
              onPress={() => onPressUsername?.(item)}
              key={item.id}
              user={item}
              containerStyle={{
                paddingHorizontal: insets.left + 15,
                marginTop: index === 0 ? 15 : 0,
              }}
              rightComponent={
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-around",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 15,
                    }}
                    onPress={() => {
                      acceptFriendRequestMutation.mutate(item.id);
                    }}
                  >
                    {(acceptFriendRequestMutation.isLoading &&
                      acceptFriendRequestMutation.variables === item.id) ||
                    (rejectFriendshipMutation.isLoading &&
                      rejectFriendshipMutation.variables === item.id) ? (
                      <Spinner size="sm" />
                    ) : (
                      <AntDesign
                        name="check"
                        size={16}
                        color={colors.success[900]}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 15,
                    }}
                    onPress={() => {
                      handlePressRejectFriendship(item.username, item.id);
                    }}
                  >
                    {(acceptFriendRequestMutation.isLoading &&
                      acceptFriendRequestMutation.variables === item.id) ||
                    (rejectFriendshipMutation.isLoading &&
                      rejectFriendshipMutation.variables === item.id) ? (
                      <Spinner size="sm" />
                    ) : (
                      <AntDesign
                        name="close"
                        size={16}
                        color={colors.error[500]}
                      />
                    )}
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
        onRefresh={() => {
          refetch();
        }}
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
            <ErrorText message="No pending requests found" />
          </View>
        }
        ListHeaderComponent={
          <TouchableOpacity onPress={() => onPressOutgoingRequests?.()}>
            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                borderBottomColor: colors.gray[300],
                borderBottomWidth: 1,
              }}
            >
              <View
                style={{
                  flex: 6,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    letterSpacing: 0.5,
                    lineHeight: 20,
                  }}
                >
                  Outgoing requests
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="black" />
            </View>
          </TouchableOpacity>
        }
      />
    </Container>
  );
};

export default PendingRoute;
