import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "@/components/Container";
import SearchBar from "@/components/SearchBar";
import { Button, Divider, Spinner } from "native-base";
import { useInfiniteQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { FetchUserFriends } from "@/api/routes/friendship";
import { ScreenHeight } from "@/constants/Layout";
import { instanceOfErrorResponseType } from "@/api/client";
import InlineUser from "@/components/InlineUser";
import { FlashList } from "@shopify/flash-list";
import { LightBackground } from "@/utils/theme";
import { SnapSyncStackScreenProps } from "@/types";
import {
  InvitedUser,
  addUser,
} from "@/business/redux/features/snapsync/snapSyncSlice";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";

type Props = {};

const InviteScreen = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"Invite">) => {
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);

  const dispatch = useDispatch();

  const [query, setQuery] = React.useState("");

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
      FetchUserFriends(user!.id, tokenApi, pageParam, 10, query),
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

  React.useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length >= 3) {
        refetch();
      } else if (query.length === 0) {
        refetch();
      }
    }, 1000);

    return () => clearTimeout(delay);
  }, [query]);

  if (!route.params.position) {
    return null;
  }

  return (
    <Container>
      <SearchBar
        query={query}
        onChangeText={(text) => setQuery(text)}
        h={40}
        onBlur={() => {
          setQuery("");
        }}
      />
      <Divider my={2} />
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
              disabled
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
                    colorScheme="primary"
                    size="sm"
                    rounded="full"
                    onPress={() => {
                      let data: InvitedUser = {
                        id: item.user.id,
                        position: route.params.position,
                        profilePictureUrl: item.user.profilePictureUrl,
                        username: item.user.username,
                      };
                      dispatch(addUser(data));

                      navigation.goBack();
                    }}
                    _text={{
                      fontWeight: "bold",
                      letterSpacing: 0.5,
                    }}
                  >
                    Invite
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

export default InviteScreen;

const styles = StyleSheet.create({});
