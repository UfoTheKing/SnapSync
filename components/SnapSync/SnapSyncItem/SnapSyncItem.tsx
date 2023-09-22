import { Image, View, StyleSheet } from "react-native";
import React from "react";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { SLIDER_ITEM_SIZE } from "./styles";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  width?: number;
  leftImage: string;
  rightImage: string;
};

type Context = {
  translateX: number;
};

const SnapSyncItem = (props: Props) => {
  const insets = useSafeAreaInsets();
  const {
    width = SCREEN_WIDTH - insets.left - insets.right,
    leftImage,
    rightImage,
  } = props;

  const translationX = useSharedValue(width / 2 - SLIDER_ITEM_SIZE / 2);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (event, ctx) => {
      ctx.translateX = translationX.value;
    },
    onActive: (event, ctx) => {
      // Calcola la nuova posizione tenendo conto della larghezza massima dello schermo
      const newX = ctx.translateX + event.translationX;
      if (newX >= 0 && newX <= width - SLIDER_ITEM_SIZE) {
        translationX.value = newX;
      }
    },
    onEnd: (event) => {},
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translationX.value,
        },
      ],
    };
  });

  const animatedLeftViewStyle = useAnimatedStyle(() => {
    return {
      width: translationX.value + SLIDER_ITEM_SIZE / 2, // Usa il valore di translationX come flessibilità
    };
  });

  const animatedRightViewStyle = useAnimatedStyle(() => {
    return {
      width: width - translationX.value + SLIDER_ITEM_SIZE / 2, // Usa il valore di translationX come flessibilità
    };
  });

  return (
    <View
      style={{
        width: width,
        height: width,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            {
              top: width / 2 - SLIDER_ITEM_SIZE / 2,
            },
            animatedStyle,
            styles.slider,
          ]}
        >
          <AntDesign name="arrowleft" size={16} color="white" />
          <AntDesign name="arrowright" size={16} color="white" />
        </Animated.View>
      </PanGestureHandler>
      <Animated.View
        style={[
          {
            height: width,
            borderRightWidth: 2,
            borderRightColor: "white",
          },
          animatedLeftViewStyle,
        ]}
      >
        <Image
          source={{
            uri: leftImage,
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      <Animated.View
        style={[
          {
            height: width,
            borderLeftWidth: 2,
            borderLeftColor: "white",
          },
          animatedRightViewStyle,
        ]}
      >
        <Image
          source={{
            uri: rightImage,
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

export default SnapSyncItem;

const styles = StyleSheet.create({
  slider: {
    width: SLIDER_ITEM_SIZE,
    height: SLIDER_ITEM_SIZE,
    backgroundColor: "#c2c2c2",
    borderRadius: 15,
    position: "absolute",
    zIndex: 100,
    elevation: 100,

    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor: "white",
    borderWidth: 2,
  },
});
