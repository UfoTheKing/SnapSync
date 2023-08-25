import { StyleSheet, View, FlatList, ViewToken } from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from "react-native-reanimated";
import { AnimationObject } from "lottie-react-native";
import CustomButton from "@/components/Onboarding/CustomButton";
import { RootStackScreenProps } from "@/types";
import Pagination from "@/components/Onboarding/Pagination";
import RenderItem from "@/components/Onboarding/RenderItem";

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require("../../assets/animations/onboarding_1.json"),
    text: "Find Friends",
    textColor: "#fff",
    backgroundColor: "#2e86c1",
  },
  {
    id: 2,
    animation: require("../../assets//animations/onboarding_2.json"),
    text: "Take A SyncPic",
    textColor: "#fff",
    backgroundColor: "#f1c40f",
  },
  {
    id: 3,
    animation: require("../../assets//animations/onboarding_3.json"),
    text: "Share Your SyncPic",
    textColor: "#fff",
    backgroundColor: "#c4d80f",
  },
];

const OnboardingScreen = ({
  navigation,
}: RootStackScreenProps<"Onboarding">) => {
  const flatListRef = useAnimatedRef<FlatList<OnboardingData>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0].index !== null) {
      flatListIndex.value = viewableItems[0].index;
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const viewabilityConfigCallbackPairs = React.useRef<any>([
    { onViewableItemsChanged },
  ]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        // @ts-ignore
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({ item, index }) => {
          return <RenderItem item={item} index={index} x={x} />;
        }}
        keyExtractor={(item) => item.id.toString()}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        // onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
          x={x}
          navigation={navigation}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 30,
    paddingVertical: 30,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
});
