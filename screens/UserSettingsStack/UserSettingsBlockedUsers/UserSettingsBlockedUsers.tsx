import React from "react";
import { UserSettingsStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useInfiniteQuery } from "react-query";
import { FetchBlockedUsers } from "@/api/routes/accounts";
import Container from "@/components/Container";
import { Divider, Spinner } from "native-base";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { FlashList } from "@shopify/flash-list";
import Inline from "@/components/User/Inline/Inline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GoBackButton from "@/components/GoBackButton";

const UserSettingsBlockedUsers = ({
  navigation,
}: UserSettingsStackScreenProps<"UserSettingsBlockedUsers">) => {
  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // HOOKS
  const insets = useSafeAreaInsets();

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
    ["blocked_users", tokenApi],
    ({ pageParam = 1 }) => FetchBlockedUsers(tokenApi, pageParam, 10),
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
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

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
      safeAreaBottom={true}
      safeAreaLeft={false}
      safeAreaRight={false}
    >
      <FlashList
        data={
          data && data.pages && data.pages.length > 0
            ? data.pages.map((page) => (page.users ? page.users : [])).flat()
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <Inline
              onPress={() => {
                navigation.navigate("UserProfileStack", {
                  screen: "UserProfile",
                  params: {
                    userId: item.id,
                    fromHome: false,

                    ...item,
                  },
                });
              }}
              key={item.id}
              user={item}
              containerStyle={{
                paddingHorizontal: insets.left + 15,
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
      />
    </Container>
  );
};

export default UserSettingsBlockedUsers;
