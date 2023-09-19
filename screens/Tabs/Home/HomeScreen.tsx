import {
  StyleSheet,
  Text,
  RefreshControl,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomeStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useQuery } from "react-query";
import { FetchTimeline } from "@/api/routes/feed";
import Container from "@/components/Container";
import { SmallUser } from "@/models/resources/User";
import AnimatedHeader, {
  HEADER_HEIGHT,
} from "@/components/Home/AnimatedHeader";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { ScreenWidth } from "@/constants/Layout";

type Props = {};

const HomeScreen = ({ navigation }: HomeStackScreenProps<"Home">) => {
  const ws = useSelector((state: RootState) => state.socket.ws);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const user = useSelector((state: RootState) => state.user.user);

  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  const {
    data: timeline,
    isLoading: timelineIsLoading,
    isError: timelineIsError,
    refetch: timelineRefetch,
    isRefetching: timelineIsRefetching,
  } = useQuery(["timeline", tokenApi], () => FetchTimeline(tokenApi), {
    enabled: isLoggedIn,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  const nodes = React.useMemo(() => {
    if (timelineIsError) return [];
    if (timelineIsLoading) return [];
    if (!timeline) return [];
    return timeline.nodes;
  }, [timeline, timelineIsLoading, timelineIsError]);

  const handlePressUser = (u: SmallUser) => {
    if (user && u.id === user.id) {
      navigation.navigate("Root", { screen: "TabUserProfileStack" });
    } else {
      navigation.navigate("UserProfileStack", {
        screen: "UserProfile",
        params: {
          userId: u.id,
          fromHome: true,
          username: u.username,
          profilePictureUrl: u.profilePictureUrl,
        },
      });
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (
        lastContentOffset.value > event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = 0;
        // console.log("scrolling up");
      } else if (
        lastContentOffset.value < event.contentOffset.y &&
        isScrolling.value
      ) {
        translateY.value = -HEADER_HEIGHT - insets.top;
        // console.log("scrolling down");
      }
      lastContentOffset.value = event.contentOffset.y;
    },
    onBeginDrag: (e) => {
      isScrolling.value = true;
    },
    onEndDrag: (e) => {
      isScrolling.value = false;
    },
  });

  return (
    <Container safeAreaTop={false}>
      <AnimatedHeader
        animatedValue={translateY}
        onPressFriends={() =>
          navigation.navigate("Root", { screen: "TabSearchStack" })
        }
        onPressProfile={() =>
          navigation.navigate("Root", { screen: "TabUserProfileStack" })
        }
      />
      {/* {timelineIsLoading ? (
        <Animated.FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({}) => {
            return <FeedSkeleton />;
          }}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + insets.top,
          }}
          scrollEnabled={false}
        />
      ) : (
        <Animated.FlatList
          data={nodes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            if (!item.feed) return null;
            return <Feed item={item.feed} handlePressUser={handlePressUser} />;
          }}
          // onRefresh={() => timelineRefetch()}
          // refreshing={timelineIsRefetching}
          refreshControl={
            <RefreshControl
              refreshing={timelineIsRefetching}
              progressViewOffset={HEADER_HEIGHT + insets.top}
              onRefresh={() => timelineRefetch()}
            />
          }
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={scrollHandler}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + insets.top,
          }}
          scrollEnabled={true}
        />
      )} */}
      <View
        style={{
          ...styles.snapSyncContainer,
          bottom: insets.bottom === 0 ? 20 : insets.bottom,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SnapSyncStack", {
              screen: "SnapSync",
              params: {
                mode: "create",
              },
            });
          }}
        >
          <View style={styles.button}>
            <AntDesign name="sync" size={24} color="#e7e7e7" />
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  snapSyncContainer: {
    position: "absolute",
    // left: 0,
    right: ScreenWidth / 2 - 37.5,
    alignItems: "center",
  },
  button: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    backgroundColor: "#fff",
    borderWidth: 10,
    borderColor: "#e7e7e7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,

    alignItems: "center",
    justifyContent: "center",
  },
});
