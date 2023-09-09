import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { DeleteFriendship, FetchUserFriends } from "@/api/routes/friendship";
import Container from "@/components/Container";
import { FlashList } from "@shopify/flash-list";
import InlineUser from "@/components/InlineUser";
import { LightBackground } from "@/utils/theme";
import { Button, Divider, Spinner, useTheme } from "native-base";
import { ScreenHeight } from "@/constants/Layout";
import { instanceOfErrorResponseType } from "@/api/client";
import { SmallUser } from "@/models/resources/User";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";

type Props = {
  onPressUsername?: (user: SmallUser) => void;
};

const FriendsRoute = (props: Props) => {
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);

  const colors = useTheme().colors;

  const queryClient = useQueryClient();

  const unfriendMutation = useMutation(
    (userId: number) => DeleteFriendship(userId, tokenApi),
    {
      onSuccess: () => {
        refetch();

        queryClient.invalidateQueries(["user", user!.id, "friends", tokenApi]);
        queryClient.removeQueries(["user", user!.id, "friends", tokenApi], {
          exact: true,
        });
      },
    }
  );

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
    ["user", user!.id, "friends", tokenApi],
    ({ pageParam = 1 }) =>
      FetchUserFriends(user!.id, tokenApi, pageParam, 10, null),
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

  const handleConfirmUnfriend = (username: string, userId: number) => {
    Alert.alert("Unfriend", `Are you sure you want to unfriend ${username}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Unfriend",
        style: "destructive",
        onPress: () => unfriendMutation.mutate(userId),
      },
    ]);
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
                .map((page) => (page.friends ? page.friends : []))
                .flat()
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <InlineUser
              onPress={() => props.onPressUsername?.(item.user)}
              key={item.user.id}
              username={item.user.username}
              fullName={item.user.fullName}
              profilePictureUrl={item.user.profilePictureUrl}
              isVerified={item.user.isVerified}
              ph={15}
              mt={index === 0 ? 15 : 0}
              bgc={LightBackground}
              rightComponent={
                <View
                  style={{
                    alignItems: "flex-end",
                    height: INLINE_USER_HEIGHT,
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Button
                    colorScheme="error"
                    size="sm"
                    rounded="full"
                    isLoading={
                      unfriendMutation.isLoading &&
                      unfriendMutation.variables === item.user.id
                    }
                    onPress={() => {
                      handleConfirmUnfriend(item.user.username, item.user.id);
                    }}
                    _text={{
                      fontWeight: "bold",
                      letterSpacing: 0.5,
                    }}
                  >
                    Unfriend
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
                No friends
              </Text>
            )}
          </View>
        }
      />
    </Container>
  );
};

export default FriendsRoute;

const styles = StyleSheet.create({});
