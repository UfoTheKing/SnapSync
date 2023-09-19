import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { SnapSyncStackScreenProps } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import Container from "@/components/Container";
import { useInfiniteQuery, useQuery } from "react-query";
import {
  CheckSnapInstance,
  FetchSnapSyncShapes,
} from "@/api/routes/snaps_sync";
import { Divider, Spinner, useTheme } from "native-base";
import { Shape as IShape } from "@/models/project/Shape";
import { createWssMessage } from "@/utils/utils";
import { WssActions } from "@/utils/wss";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SnapSyncData, SnapSyncUser } from "@/models/wss/SnapSync";
import {
  addUser,
  changeShape,
  initSnapSyncData,
  reset,
  setTimerCompleted,
  updateSnapSyncData,
} from "@/business/redux/features/snapsync/snapSyncSlice";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import ErrorText from "@/components/Error/ErrorText/ErrorText";
import SnapSyncMenu from "@/components/SnapSync/SnapSyncMenu/SnapSyncMenu";
import { ScreenHeight, ScreenWidth } from "@/constants/Layout";
import SnapSyncGrid from "@/components/SnapSync/SnapSyncGrid/SnapSyncGrid";
import { CreateSnapInstanceDto } from "@/models/dto/SnapSync";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import BottomSheetModalCustomBackdrop from "@/components/BottomSheetModal/BottomSheetModalCustomBackdrop/BottomSheetModalCustomBackdrop";
import { FetchUserFriends } from "@/api/routes/friendship";
import Inline from "@/components/User/Inline/Inline";
import { FlashList } from "@shopify/flash-list";
import { INLINE_USER_HEIGHT } from "@/components/User/styles";
import { SmallUser } from "@/models/resources/User";
import { SystemMessage } from "@/models/wss/SystemMessage";
import { ErrorMessage } from "@/models/wss/ErrorMessage";
import Toast from "react-native-toast-message";
import SnapSyncTitle from "@/components/SnapSync/SnapSyncTitle/SnapSyncTitle";
import { Camera } from "expo-camera";
import GoBackButton from "@/components/GoBackButton";
import useCountdown from "@bradgarropy/use-countdown";
import { Image } from "expo-image";

const SnapSync = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"SnapSync">) => {
  const { mode, key } = route.params;

  const [permission, requestPermission] = Camera.useCameraPermissions();

  // REDUX
  const ws = useSelector((state: RootState) => state.socket.ws);
  const isLogged = useSelector((state: RootState) => state.socket.isLogged);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);
  const snapSync = useSelector((state: RootState) => state.snapSync.snapSync);
  const createdByMe = useSelector(
    (state: RootState) => state.snapSync.createdByMe
  );
  const users = useSelector((state: RootState) => state.snapSync.users);
  const snap = useSelector((state: RootState) => state.snapSync.snap);
  const dispatch = useDispatch();

  // REFS
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const selectedPosition = useRef<string | null>(null);
  const p = useRef<boolean>(false);

  // HOOKS
  const insets = useSafeAreaInsets();
  const colors = useTheme().colors;
  const fontSizes = useTheme().fontSizes;
  const { dismissAll } = useBottomSheetModal();
  const countdown = useCountdown({
    minutes: snapSync?.timer.minutes || 0,
    seconds: snapSync?.timer.seconds || 10,
    format: "mm:ss",
    autoStart: false,
    onCompleted: () => onCompleted(),
  });

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

  // MUTATIONS

  // QUERIES
  const {
    data: shapes,
    isLoading,
    isError,
    error,
  } = useQuery("shapes", () => FetchSnapSyncShapes(tokenApi), {
    enabled: isLoggedIn && mode === "create",
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
  });

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
    ({ pageParam = 1 }) => FetchUserFriends(tokenApi, pageParam, 10, null),
    {
      enabled: false,
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

  const {
    data: check,
    isLoading: isLoadingCheck,
    isError: isErrorCheck,
    error: errorCheck,
  } = useQuery(
    ["check", key || "", tokenApi],
    () => CheckSnapInstance(key || "", tokenApi),
    {
      enabled: isLoggedIn && mode === "join" && key !== undefined,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchIntervalInBackground: false,
    }
  );

  // STATES
  const [initialShape, setInitialShape] = React.useState<IShape | null>(null);
  const [layout, setLayout] = React.useState<{ h: number; w: number }>({
    h: ScreenHeight - insets.top - insets.bottom,
    w: ScreenWidth,
  });
  const [isLoadingCreate, setIsLoadingCreate] = React.useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = React.useState(false);
  const [forceReturnToHome, setForceReturnToHome] = React.useState(false);

  // MEMOS
  const snapPoints = useMemo(() => ["50%", "80%"], []);
  const shapeRatio = useMemo(() => {
    if (initialShape) {
      return initialShape.width / initialShape.height;
    }
    return 1;
  }, [initialShape]);

  // EFFECTS
  React.useEffect(() => {
    if (permission && permission.granted === false) {
      requestPermission();
    }
  }, [permission]);

  React.useEffect(() => {
    if (shapes && shapes.shapes && shapes.shapes.length > 0) {
      setInitialShape(shapes.shapes[0]);
    }
  }, [shapes]);

  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (snapSync && ws && isLogged) {
        if (!p.current) {
          ws.send(createWssMessage(WssActions.LeaveSnapInstance));
        }
      }

      dispatch(reset());
    });
  }, [snapSync, navigation, ws, isLogged, p.current]);

  React.useEffect(() => {
    if (
      initialShape &&
      mode === "create" &&
      ws &&
      initialShape.numberOfUsers === users.length &&
      !snapSync
    ) {
      setIsLoadingCreate(true);

      let usersWithoutOwner = users.filter((u) => u.isJoined === false);

      let data: CreateSnapInstanceDto = {
        snapShapeId: initialShape.id,
        users: usersWithoutOwner.map((u) => {
          return {
            id: u.id,
            position: u.position,
          };
        }),
      };

      ws.send(
        createWssMessage(
          WssActions.CreateSnapInstance,
          undefined,
          undefined,
          data
        )
      );
    }
  }, [users, initialShape, mode, ws, snapSync]);

  React.useEffect(() => {
    if (forceReturnToHome) {
      p.current = true;
      // Rimuovo gli screen TakeSnap e SnapSync dalla history e torno alla TabHomeStack
      navigation.navigate("Root", {
        screen: "TabHomeStack",
      });
    }
  }, [forceReturnToHome, navigation]);

  React.useEffect(() => {
    if (ws && check && check.isJoinable && mode === "join" && key) {
      setInitialShape(check.shape);
      setIsLoadingJoin(true);
      let m = createWssMessage(
        WssActions.JoinSnapInstance,
        undefined,
        undefined,
        {
          key: key,
        }
      );

      ws.send(m);
    }
  }, [ws, mode, key, check]);

  React.useEffect(() => {
    if (initialShape && user) {
      let ownerPosition = initialShape.positions.find(
        (p) => p.ownerPosition === true
      );
      if (ownerPosition) {
        let me: SnapSyncUser = {
          position: ownerPosition.name,
          id: user.id,
          username: user.username,
          profilePictureUrl: user.profilePictureUrl,
          isJoined: true,
        };

        dispatch(addUser(me));
      }
    }
  }, [initialShape, user]);

  React.useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data && data.success) {
          data = data as SystemMessage;

          if (data.action === WssActions.CreateSnapInstance && data.data) {
            setIsLoadingCreate(false);
            dispatch(
              initSnapSyncData({
                snapSync: data.data as SnapSyncData,
                createdByMe: true,
              })
            );
          } else if (data.action === WssActions.JoinSnapInstance && data.data) {
            setIsLoadingJoin(false);
            dispatch(updateSnapSyncData(data.data as SnapSyncData));
          } else {
            if (data && data.data && data.data.exit) {
              let message =
                "Ops! Something went wrong. Please try again later.";
              if (data.message) {
                message = data.message;
              }

              Toast.show({
                type: "error",
                text1: "Error",
                text2: message,
              });

              // Significa che è successo qualcosa: un utente è uscito, ecc...
              // Forze l'utente a tornare indietro
              setForceReturnToHome(true);
            }
          }
        } else {
          data = data as ErrorMessage;
          let message =
            data && data.message ? data.message : "Ops! Something went wrong";
          Toast.show({
            position: "bottom",
            text1: "Error",
            text2: message,
            type: "error",
          });

          setIsLoadingCreate(false);
        }
      };
    }
  }, [ws]);

  React.useEffect(() => {
    if (snap.cameraIsReady) {
      countdown.start();
    }
  }, [snap.cameraIsReady]);

  // FUNCTIONS
  const handleChangeShape = (shape: IShape) => {
    let ownerPosition = shape.positions.find((p) => p.ownerPosition === true);
    if (ownerPosition && user) {
      let me: SnapSyncUser = {
        position: ownerPosition.name,
        id: user.id,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
        isJoined: true,
      };
      dispatch(changeShape(me));
      setInitialShape(shape);
    }
  };

  const handlePressInvite = (position: string) => {
    if (!friends) refetchFriends();
    handlePresentModalPress();

    selectedPosition.current = position;
  };

  const handleAddUser = (user: SmallUser) => {
    if (selectedPosition.current) {
      let newUser: SnapSyncUser = {
        id: user.id,
        username: user.username,
        profilePictureUrl: user.profilePictureUrl,
        position: selectedPosition.current,
        isJoined: false,
      };

      dispatch(addUser(newUser));
      handleDismissModalPress();
    }
  };

  const onCompleted = () => {
    dispatch(setTimerCompleted(true));
  };

  if (!ws || !isLogged) {
    return (
      <Container textCenter>
        <ErrorText message="There is no connection to the server. Please try again later" />
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
        </TouchableOpacity>
      </Container>
    );
  }

  if (mode === "create") {
    if (isLoading) {
      return (
        <Container textCenter>
          <Spinner size="sm" />
        </Container>
      );
    }

    if (isError || !shapes) {
      return (
        <Container textCenter>
          <ErrorHandler error={error} />
        </Container>
      );
    }

    if (shapes.shapes.length === 0) {
      return (
        <Container textCenter>
          <ErrorText message="Ops! There is no shape available for SnapSync" />
        </Container>
      );
    }
  }

  if (mode === "join") {
    if (isLoadingCheck || isLoadingJoin) {
      return (
        <Container textCenter>
          <Spinner size="sm" />
        </Container>
      );
    }

    if (isErrorCheck) {
      return (
        <Container textCenter>
          <ErrorHandler error={errorCheck} />
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text
              style={{
                color: colors.red[500],
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Exit
            </Text>
          </TouchableOpacity>
        </Container>
      );
    }
  }

  if (!initialShape) {
    return null;
  }

  if (users.length === 0) {
    return (
      <Container textCenter>
        <ErrorText message="Ops! Something went wrong" />
      </Container>
    );
  }

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Container textCenter>
        <ErrorText message="Ops! You need to grant camera permission to use SnapSync" />
      </Container>
    );
  }

  if (snap.uri) {
    return (
      <Container textCenter>
        <Image source={{ uri: snap.uri }} style={{ width: 270, height: 480 }} />
      </Container>
    );
  }

  return (
    <Container
      safeAreaLeft={false}
      safeAreaRight={false}
      safeAreaTop={false}
      safeAreaBottom={false}
    >
      <View
        style={[
          styles.grid,
          {
            // maxHeight: ScreenHeight,
            alignItems: "center",
            justifyContent: "center",
            marginTop: insets.top,
            // maxHeight: initialShape.height,
            // maxWidth: initialShape.width,
            marginBottom: insets.bottom,
          },
        ]}
        // onLayout={(e) => {
        //   setLayout({
        //     h: e.nativeEvent.layout.height,
        //     w: e.nativeEvent.layout.width,
        //   });
        // }}
      >
        <SnapSyncGrid
          shape={initialShape}
          cHeight={
            Math.floor(layout.w / shapeRatio) - 50 - insets.top - insets.bottom
          }
          cWidth={Math.floor(
            layout.w - (50 + insets.top + insets.bottom) * shapeRatio
          )}
          handlePressAddUser={handlePressInvite}
        />

        <View
          style={{
            height: 50 + insets.bottom,
            width: ScreenWidth,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            alignItems: "center",
            justifyContent: "center",
            // paddingBottom: insets.bottom
          }}
        >
          <SnapSyncTitle
            message={
              snapSync
                ? snapSync.timer.start
                  ? snapSync.title.replaceAll(
                      "{{timer}}",
                      countdown.seconds.toString()
                    )
                  : snapSync.title
                : "Invite your friends and start syncing!"
            }
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={isLoadingCreate}
          >
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
          </TouchableOpacity>
        </View>
      </View>

      {snapSync ? null : mode === "create" && initialShape ? (
        <SnapSyncMenu
          selectedShape={initialShape}
          shapes={shapes ? shapes.shapes : []}
          onChange={handleChangeShape}
          disabled={isLoadingCreate}
        />
      ) : null}

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <FlashList
            data={
              friends && friends.pages && friends.pages.length > 0
                ? friends.pages
                    .map((page) => (page.friends ? page.friends : []))
                    .flat()
                    .filter(
                      (f) => users.find((u) => u.id === f.id) === undefined
                    )
                : []
            }
            renderItem={({ item, index }) => {
              return (
                <Inline
                  onPress={() => handleAddUser(item)}
                  // disabled
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
              if (hasNextPageFriends) fetchNextPageFriends();
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetchingNextPageFriends ? <Spinner size="sm" /> : undefined
            }
            ItemSeparatorComponent={() => <Divider my={2} />}
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
        </View>
      </BottomSheetModal>
    </Container>
  );
};

export default SnapSync;

const styles = StyleSheet.create({
  grid: {
    flex: 1,
  },
});
