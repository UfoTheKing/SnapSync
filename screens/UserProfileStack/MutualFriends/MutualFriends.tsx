import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserProfileStackScreenProps } from "@/types";
import HeaderUsername from "@/components/UserProfile/HeaderUsername/HeaderUsername";
import { LightBackground } from "@/utils/theme";
import GoBackButton from "@/components/GoBackButton";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useInfiniteQuery, useQueryClient } from "react-query";
import { FetchMutualFriends } from "@/api/routes/friendship";
import Container from "@/components/Container";
import { FlashList } from "@shopify/flash-list";
import Inline from "@/components/User/Inline/Inline";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { Divider, Spinner } from "native-base";
import { ScreenHeight } from "@/constants/Layout";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";

type Props = {};

const MutualFriends = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"MutualFriends">) => {
  const { userId, username, isVerified } = route.params;

  // REDUX
  const user = useSelector((state: RootState) => state.user.user);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  // REFS

  // HOOKS
  const queryClient = useQueryClient();

  // MUTATIONS

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
    ["user", userId, "mutualFriends", tokenApi],
    ({ pageParam = 1 }) =>
      FetchMutualFriends(userId, tokenApi, pageParam, 30, null),
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

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerShadowVisible: false,
      headerStyle: {
        backgroundColor: LightBackground,
      },
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
      headerTitle: () => (
        <HeaderUsername username={username} isVerified={isVerified} />
      ),
      headerTitleAlign: "center",
    });
  }, [navigation, username, isVerified]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      queryClient.removeQueries(["user", userId, "mutualFriends", tokenApi]);
    });
  }, [navigation, queryClient]);

  return (
    <Container safeAreaTop={false}>
      <FlashList
        data={
          data && data.pages && data.pages.length > 0
            ? data.pages.map((page) => (page.users ? page.users : [])).flat()
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <Inline
              disabled
              key={item.id}
              user={item}
              containerStyle={{
                paddingHorizontal: 15,
                marginTop: index === 0 ? 15 : 0,
              }}
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
              <Spinner size="sm" />
            ) : isError ? (
              <ErrorHandler error={error} />
            ) : null}
          </View>
        }
      />
    </Container>
  );
};

export default MutualFriends;

const styles = StyleSheet.create({});
