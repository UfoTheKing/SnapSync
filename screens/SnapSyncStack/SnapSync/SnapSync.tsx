import { StyleSheet, View } from "react-native";
import React from "react";
import { SnapSyncStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import Container from "@/components/Container";
import { useInfiniteQuery, useMutation } from "react-query";
import { CreateSnapInstance } from "@/api/routes/snaps_sync";
import { Divider, Spinner } from "native-base";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FetchUserFriends } from "@/api/routes/friendship";
import Toast from "react-native-toast-message";
import { Camera } from "expo-camera";
import { FlashList } from "@shopify/flash-list";
import Inline from "@/components/User/Inline/Inline";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import SyncButton from "@/components/User/Buttons/SyncButton/SyncButton";
import GoBackButton from "@/components/GoBackButton";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import { RootStyles } from "@/screens/RootStack/styles";
import { useFocusEffect } from "@react-navigation/native";
import { instanceOfErrorResponseType } from "@/api/client";

const SnapSync = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"SnapSync">) => {
  // REDUX
  const ws = useSelector((state: RootState) => state.socket.ws);
  const isLogged = useSelector((state: RootState) => state.socket.isLogged);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // REFS

  // HOOKS
  const insets = useSafeAreaInsets();

  // CALLBACKS

  // MUTATIONS
  const createSnapInstanceMutation = useMutation(
    (userId: number) => CreateSnapInstance(userId, tokenApi),
    {
      onSuccess: (data) => {
        navigation.goBack();
      },
      onError: (error) => {
        let message = "Ops! Something went wrong";
        if (error && instanceOfErrorResponseType(error)) {
          message = error.message;
        }

        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          position: "bottom",
        });
      },
    }
  );

  // QUERIES

  const {
    data: friends,
    isLoading: isLoadingFriends,
    isError: isErrorFriends,
    error: errorFriends,
    fetchNextPage: fetchNextPageFriends,
    isFetchingNextPage: isFetchingNextPageFriends,
    hasNextPage: hasNextPageFriends,
    refetch: refetchFriends,
    isRefetching: isRefetchingFriends,
  } = useInfiniteQuery(
    ["user", "friends", tokenApi],
    ({ pageParam = 1 }) =>
      FetchUserFriends(tokenApi, pageParam, 10, null, true),
    {
      enabled: isLoggedIn && isLogged,
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
      headerLeft: () => (
        <GoBackButton onPress={() => navigation.goBack()} type={"back"} />
      ),
      headerTitle: "",
      headerShadowVisible: false,
      headerTitleStyle: RootStyles.headerTitleStyle,
    });
  }, [navigation]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     refetchFriends();
  //   }, [])
  // );

  // FUNCTIONS

  if (!ws || !isLogged) {
    return (
      <Container textCenter>
        <ErrorText message="There is no connection to the server. Please try again later" />
      </Container>
    );
  }

  if (isLoadingFriends) {
    return (
      <Container textCenter>
        <Spinner size="sm" />
      </Container>
    );
  }

  if (isErrorFriends) {
    return (
      <Container textCenter>
        <ErrorHandler error={errorFriends} />
      </Container>
    );
  }

  return (
    <Container safeAreaTop={false}>
      <FlashList
        data={
          friends && friends.pages && friends.pages.length > 0
            ? friends.pages
                .map((page) => (page.friends ? page.friends : []))
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
                  <SyncButton
                    onPress={() => createSnapInstanceMutation.mutate(item.id)}
                    isLoading={
                      createSnapInstanceMutation.isLoading &&
                      createSnapInstanceMutation.variables === item.id
                    }
                    disabled={createSnapInstanceMutation.isLoading}
                  />
                </View>
              }
            />
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        estimatedItemSize={INLINE_USER_HEIGHT}
        onEndReached={() => {
          if (hasNextPageFriends) fetchNextPageFriends();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPageFriends ? <Spinner size="sm" /> : undefined
        }
        ItemSeparatorComponent={() => <Divider my={2} />}
        refreshing={isRefetchingFriends}
        onRefresh={() => refetchFriends()}
      />

      {/* <SnapSyncItem
        leftImage="https://wallpapers.com/images/high/1080x1080-xbox-random-stuff-6vmseb62ce9zbijt.webp"
        rightImage="https://wallpapers.com/images/high/1080x1080-xbox-forza-motorsport-7jnx2btyiz2tm5ht.webp"
      />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text
          style={{
            color: colors.red[500],
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 10,
          }}
        >
          Leave
        </Text>
      </TouchableOpacity> */}
    </Container>
  );
};

export default SnapSync;

const styles = StyleSheet.create({
  grid: {
    flex: 1,
  },
});
