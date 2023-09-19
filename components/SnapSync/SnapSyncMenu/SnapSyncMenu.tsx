import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ScreenHeight } from "@/constants/Layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shape } from "@/models/project/Shape";
import { HEIGHT, ITEM_SIZE, PADDING, WIDTH } from "./styles";
import { Image } from "expo-image";

type Props = {
  selectedShape: Shape;
  shapes: Shape[];

  onChange: (shape: Shape) => void;

  disabled?: boolean;
};

const SnapSyncMenu = (props: Props) => {
  const { selectedShape, shapes, onChange, disabled } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(isOpen ? WIDTH : ITEM_SIZE, { duration: 250 }),
      height: withTiming(isOpen ? HEIGHT : ITEM_SIZE, { duration: 250 }),
      backgroundColor: withTiming(isOpen ? "#a2a2a2" : "transparent", {
        duration: 250,
      }),
      padding: withTiming(isOpen ? PADDING : 0, { duration: 250 }),
    };
  });

  const animatedSecondViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // translateY: withTiming(isOpen ? 0 : 0, { duration: 250 }),
          translateX: withTiming(isOpen ? ITEM_SIZE : 0, { duration: 250 }),
        },
      ],
    };
  });

  const animatedThirdViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isOpen ? ITEM_SIZE : 0, { duration: 250 }),
        },
      ],
    };
  });

  const animatedFourthViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isOpen ? ITEM_SIZE : 0, { duration: 250 }),
        },
        {
          translateX: withTiming(isOpen ? ITEM_SIZE : 0, { duration: 250 }),
        },
      ],
    };
  });

  const animatedFifthViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isOpen ? ITEM_SIZE * 2 : 0, { duration: 250 }),
        },
      ],
    };
  });

  const animatedSixthViewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isOpen ? ITEM_SIZE * 2 : 0, { duration: 250 }),
        },
        {
          translateX: withTiming(isOpen ? ITEM_SIZE : 0, { duration: 250 }),
        },
      ],
    };
  });

  const animatedOpacity = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isOpen ? 1 : 0, { duration: 100 }),
    };
  });

  return (
    <Animated.View
      style={[
        {
          // backgroundColor: isOpen ? "red" : "green",
          position: "absolute",
          top: ScreenHeight / 2 - HEIGHT / 2 - insets.top,
          left: insets.left + 10,
          zIndex: isOpen ? 10 : 0,
          elevation: isOpen ? 10 : 0,
          borderRadius: ITEM_SIZE / 2,
          // padding: PADDING,
        },
        animatedStyle,
      ]}
    >
      {shapes.map((shape, index) => {
        return (
          <TouchableOpacity
            key={shape.id}
            onPress={() => {
              // console.log(shape.id);
              if (isOpen) {
                onChange(shape);
              }
              setIsOpen(!isOpen);
            }}
            disabled={disabled}
          >
            <Animated.View
              style={[
                styles.cell,
                {
                  top: -ITEM_SIZE * index,
                },
                index === 1
                  ? animatedSecondViewStyle
                  : index === 2
                  ? animatedThirdViewStyle
                  : index === 3
                  ? animatedFourthViewStyle
                  : index === 4
                  ? animatedFifthViewStyle
                  : index === 5
                  ? animatedSixthViewStyle
                  : {},
                shape.id === selectedShape.id ? {} : animatedOpacity,
                {
                  backgroundColor:
                    isOpen && shape.id === selectedShape.id
                      ? "white"
                      : "transparent",
                },
              ]}
              // key={shape.id}
            >
              <Image
                source={{ uri: shape.iconUrl }}
                style={{
                  width: 30,
                  height: 30,
                  // borderRadius: ITEM_SIZE / 2,
                }}
              />
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

export default SnapSyncMenu;

const styles = StyleSheet.create({
  cell: {
    height: ITEM_SIZE,
    width: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderRadius: ITEM_SIZE / 2,
  },
});
