import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useInfiniteQuery, useMutation } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import {
  DeleteFriendship,
  FetchOutgoingFriendRequests,
} from "@/api/routes/friendship";
import { instanceOfErrorResponseType } from "@/api/client";
import { Button } from "native-base";
import Container from "@/components/Container";
import { FlashList } from "@shopify/flash-list";
import InlineUser, { INLINE_USER_HEIGHT } from "@/components/InlineUser";
import { LightBackground } from "@/utils/theme";
import { Divider, Spinner } from "native-base";
import { ScreenHeight } from "@/constants/Layout";

type Props = {};

const OutgoingRequestsScreen = (props: Props) => {
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

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
    ["user", "outgoing_requests", tokenApi],
    ({ pageParam = 1 }) =>
      FetchOutgoingFriendRequests(tokenApi, pageParam, 10, null),
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
      `Are you sure you want to delete your friend request to ${username}?`,
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
        data={
          data && data.pages && data.pages.length > 0
            ? data.pages
                .map((page) =>
                  page.pendingRequests ? page.pendingRequests : []
                )
                .flat()
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <InlineUser
              disabled
              key={item.user.id}
              username={item.user.username}
              fullName={item.user.fullName}
              profilePictureUrl={item.user.profilePictureUrl}
              isVerified={item.user.isVerified}
              ph={15}
              mt={index === 0 ? 15 : 0}
              bgc={LightBackground}
              contact={item.user.isContact}
              showContact={true}
              rightComponent={
                <View
                  style={{
                    alignItems: "center",
                    height: INLINE_USER_HEIGHT,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    colorScheme="error"
                    size="sm"
                    rounded="full"
                    isLoading={
                      destroyFriendshipMutation.isLoading &&
                      destroyFriendshipMutation.variables === item.user.id
                    }
                    onPress={() => {
                      handlePressDestroyFriendship(
                        item.user.username,
                        item.user.id
                      );
                    }}
                    _text={{
                      fontWeight: "bold",
                      letterSpacing: 0.5,
                    }}
                  >
                    Cancel
                  </Button>
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
            ) : null}
          </View>
        }
      />
    </Container>
  );
};

export default OutgoingRequestsScreen;

const styles = StyleSheet.create({});
