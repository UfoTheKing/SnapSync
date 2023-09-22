import { Alert, Text, View, StyleSheet } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
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
import { Button, Divider, Spinner, useTheme } from "native-base";
import { ScreenHeight } from "@/constants/Layout";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserPortalView from "@/components/User/UserPortalView/UserPortalView";
import UnfriendButton from "@/components/User/Buttons/UnfriendButton/UnfriendButton";
import {
  BottomSheetFooter,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import BottomSheetModalCustomBackdrop from "@/components/BottomSheetModal/BottomSheetModalCustomBackdrop/BottomSheetModalCustomBackdrop";
import Avatar from "@/components/User/Avatar/Avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // HOOKS
  const colors = useTheme().colors;
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { dismissAll } = useBottomSheetModal();

  // MEMOS
  const snapPoints = useMemo(() => ["50%"], []);

  // CALLBACKS
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetModalCustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalPress}
      />
    ),
    []
  );
  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View style={styles.footerContainer}>
          <Button
            bgColor={"error.500"}
            onPress={() => {
              if (user) {
                dismissAll();
                unfriendMutation.mutate(user.id);
              }
            }}
            rounded="lg"
            _text={{
              color: "white",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            Unfriend
          </Button>
        </View>
      </BottomSheetFooter>
    ),
    []
  );

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
  const [user, setUser] = React.useState<SmallUser | null>(null);
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

                setUser(item);
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
                  <UnfriendButton
                    isLoading={unfriendMutation.isLoading}
                    onPress={() => {
                      setUser(item);
                      handlePresentModalPress();
                    }}
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
            <ErrorText message="No friends found" />
          </View>
        }
      />

      {/* {user && coordinates && (
        <UserPortalView
          user={user}
          coordinates={coordinates}
          onDismiss={() => {
            setUser(null);
            setCoordinates(null);
          }}
        />
      )} */}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              alignItems: "center",
              paddingVertical: 15,
              paddingLeft: insets.left + 10,
              paddingRight: insets.right + 10,
            }}
          >
            <Avatar size={75} profilePictureUrl={user?.profilePictureUrl} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Unfriend {user?.username}?
            </Text>
          </View>
          <View
            style={{
              paddingLeft: insets.left + 10,
              paddingRight: insets.right + 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons name="bell-off" size={16} color="black" />
              <Text style={{ color: colors.black, marginLeft: 10 }}>
                We will not notify them.
              </Text>
            </View>
            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="sync" size={16} color="black" />
              <Text style={{ color: colors.black, marginLeft: 10 }}>
                You and this user can not invite each other to SnapsSync.
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetModal>
    </Container>
  );
};

export default FriendsRoute;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  footerContainer: {
    height: 74,
    borderTopColor: "grey",
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
