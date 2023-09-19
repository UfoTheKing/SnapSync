import { Alert, TouchableOpacity, View } from "react-native";
import React from "react";
import { SmallUser } from "@/models/resources/User";
import { useFocusEffect } from "@react-navigation/native";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { DeleteFriendship, FetchUserFriends } from "@/api/routes/friendship";
import Container from "@/components/Container";
import { FlashList } from "@shopify/flash-list";
import Inline from "@/components/User/Inline/Inline";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { Divider, Spinner, useTheme } from "native-base";
import { ScreenHeight } from "@/constants/Layout";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserPortalView from "@/components/User/UserPortalView/UserPortalView";

type Props = {
  onPressUsername?: (user: SmallUser) => void;
};

const FriendsRoute = (props: Props) => {
  const { onPressUsername } = props;

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
  const unfriendMutation = useMutation(
    (userId: number) => DeleteFriendship(userId, tokenApi),
    {
      onSuccess: () => {
        refetch();

        queryClient.invalidateQueries(["user", "friends", tokenApi]);
        queryClient.removeQueries(["user", "friends", tokenApi], {
          exact: true,
        });
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
    ["user", "friends", tokenApi],
    ({ pageParam = 1 }) => FetchUserFriends(tokenApi, pageParam, 10, null),
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

  // STATES
  const [userId, setUserId] = React.useState<number | null>(null);
  const [coordinates, setCoordinates] = React.useState<{
    x: number;
    y: number;
  } | null>(null);

  // EFFECTS
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
  const handleConfirmUnfriend = (username: string, userId: number) => {
    Alert.alert(
      `Unfriend ${username}?`,
      "If you unfriend someone, we will not notify them. ",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unfriend",
          style: "destructive",
          onPress: () => unfriendMutation.mutate(userId),
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
                .map((page) => (page.friends ? page.friends : []))
                .flat()
            : []
        }
        renderItem={({ item, index }) => {
          return (
            <Inline
              onPress={() => onPressUsername?.(item)}
              onLongPress={(e) => {
                const { pageY, locationY } = e.nativeEvent;

                let y = pageY - locationY;

                setUserId(item.id);
                setCoordinates({
                  x: 0,
                  y: y,
                });
              }}
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
                  <TouchableOpacity
                    style={{
                      width: 30,
                      height: 30,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 15,
                    }}
                    onPress={() =>
                      handleConfirmUnfriend(item.username, item.id)
                    }
                  >
                    <AntDesign
                      name="deleteuser"
                      size={16}
                      color={colors.error[500]}
                    />
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
            <ErrorText message="No friends found" />
          </View>
        }
      />

      {userId && coordinates && (
        <UserPortalView
          userId={userId}
          coordinates={coordinates}
          onDismiss={() => {
            setUserId(null);
            setCoordinates(null);
          }}
        />
      )}
    </Container>
  );
};

export default FriendsRoute;
