import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserProfileStackScreenProps } from "@/types";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { LightBackground } from "@/utils/theme";
import GoBackButton from "@/components/GoBackButton";
import { Ionicons } from "@expo/vector-icons";
import { Divider, Spinner, useTheme } from "native-base";
import Container from "@/components/Container";
import SearchBar from "@/components/SearchBar";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { FetchUserFriends } from "@/api/routes/friendship";
import { FlashList } from "@shopify/flash-list";
import InlineUser from "@/components/InlineUser";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { ScreenHeight } from "@/constants/Layout";
import { instanceOfErrorResponseType } from "@/api/client";

type Props = {};

const FriendsListScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"FriendsList">) => {
  const { userId, username, isVerified } = route.params;

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const colors = useTheme().colors;

  const queryClient = useQueryClient();

  const [query, setQuery] = React.useState<string>("");

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
    ["user", userId, "friends", tokenApi],
    ({ pageParam = 1 }) =>
      FetchUserFriends(userId, tokenApi, pageParam, 10, query),
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
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: LightBackground,
      },
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
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
            {username.length > 25 ? username.slice(0, 25) + "..." : username}
          </Text>
          {isVerified && (
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
    });

    navigation.addListener("beforeRemove", (e) => {
      queryClient.removeQueries(["user", userId, "friends", tokenApi]);
    });
  }, [navigation, username, isVerified]);

  if (isLoading) {
    return null;
  }

  return (
    <Container safeAreaTop={false} safeAreaLeft={false} safeAreaRight={false}>
      <View style={styles.searchContainer}>
        <SearchBar
          query={query}
          onChangeText={(text) => setQuery(text)}
          onBlur={() => {
            setQuery("");
          }}
        />
      </View>
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
              onPress={() => {
                navigation.push("UserProfile", {
                  userId: item.user.id,
                  username: item.user.username,
                  profilePictureUrl: item.user.profilePictureUrl,
                  fromHome: false,
                });
              }}
              key={item.user.id}
              username={item.user.username}
              fullName={item.user.fullName}
              profilePictureUrl={item.user.profilePictureUrl}
              isVerified={item.user.isVerified}
              ph={15}
              mt={index === 0 ? 15 : 0}
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

export default FriendsListScreen;

const styles = StyleSheet.create({
  searchContainer: {
    paddingVertical: 8,
  },
});
