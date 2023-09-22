import { Text, View, Platform, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { SearchStackScreenProps } from "@/types";
import GoBackButton from "@/components/GoBackButton";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useInfiniteQuery, useMutation } from "react-query";
import {
  DeleteFriendship,
  FetchOutgoingFriendRequests,
} from "@/api/routes/friendship";
import Container from "@/components/Container";
import { FlashList } from "@shopify/flash-list";
import Inline from "@/components/User/Inline/Inline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { Divider, Spinner, useTheme } from "native-base";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import { ScreenHeight } from "@/constants/Layout";
import { AntDesign } from "@expo/vector-icons";
import DestroyButton from "@/components/User/Buttons/DestroyButton/DestroyButton";

const OutgoingRequests = ({
  navigation,
  route,
}: SearchStackScreenProps<"OutgoingRequests">) => {
  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // REFS

  // HOOKS
  const insets = useSafeAreaInsets();
  const colors = useTheme().colors;

  // MUTATIONS
  const destroyFriendshipMutation = useMutation(
    (userId: number) => DeleteFriendship(userId, tokenApi),
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

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        Platform.OS === "ios" ? null : (
          <GoBackButton onPress={() => navigation.goBack()} />
        ),
    });
  }, [navigation, Platform]);

  // FUNCTIONS

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
              disabled
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
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <DestroyButton
                    onPress={() => {
                      destroyFriendshipMutation.mutate(item.id);
                    }}
                    isLoading={
                      destroyFriendshipMutation.isLoading &&
                      destroyFriendshipMutation.variables === item.id
                    }
                  />
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
      />
    </Container>
  );
};

export default OutgoingRequests;
