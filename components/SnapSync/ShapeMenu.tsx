import { Image, View, Animated, StyleSheet } from "react-native";
import React from "react";
import { Shape } from "@/models/project/Shape";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenHeight } from "@/constants/Layout";
import { Portal } from "react-native-portalize";
import { BlurView } from "expo-blur";

type Props = {
  shape: Shape | null;
  shapes: Shape[];
  open: boolean;
  toggleOpen: () => void;
  changeShape: (shape: Shape) => void;

  disabled: boolean;
};

export const DELAY = 250;

const FULL_WIDTH = 125;
const SHRINK_WIDTH = 50;

const FULL_HEIGHT = 170;
const SHRINK_HEIGHT = 50;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const ShapeMenu = (props: Props) => {
  const { shape, open, toggleOpen, changeShape, disabled } = props;

  const insets = useSafeAreaInsets();

  const [width] = React.useState(new Animated.Value(SHRINK_WIDTH));
  const [height] = React.useState(new Animated.Value(SHRINK_HEIGHT));
  const [scale] = React.useState(new Animated.Value(0));
  const [opacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (open) {
      handleOpen();
    } else {
      handleClose();
    }
  }, [open]);

  const handleOpen = () => {
    Animated.timing(width, {
      toValue: FULL_WIDTH,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(height, {
      toValue: FULL_HEIGHT,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(opacity, {
      toValue: 50,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(scale, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
      delay: 250,
    }).start();
  };

  const handleClose = () => {
    Animated.timing(width, {
      toValue: SHRINK_WIDTH,
      duration: 250,
      useNativeDriver: false,
    }).start();

    Animated.timing(height, {
      toValue: SHRINK_HEIGHT,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Portal>
      <View
        style={{
          position: "absolute",
          top: ScreenHeight / 2,
          left: insets.left + 10,
          opacity: disabled ? 0.5 : 1,
        }}
        onTouchStart={() => {
          if (disabled) return;
          if (!open) toggleOpen();
          // toggleOpen();
        }}
      >
        <Animated.View
          style={[
            {
              width: width,
              height: height,
              borderRadius: 25,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            },
          ]}
        >
          {open ? (
            <Animated.FlatList
              data={props.shapes}
              numColumns={2}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item, index }) => {
                return (
                  <Animated.View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: "#f7f7f7",
                      marginRight: index % 2 === 0 ? 15 : 0,
                      marginBottom: 15,
                      transform: [
                        {
                          scale: scale.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1],
                            extrapolate: "clamp",
                          }),
                        },
                      ],
                    }}
                    onTouchStart={() => {
                      if (disabled) return;
                      Animated.timing(scale, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: false,
                      }).start();

                      Animated.timing(opacity, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: false,
                      }).start();

                      toggleOpen();
                      changeShape(item);
                    }}
                  >
                    <Image
                      source={{
                        uri:
                          item.id === shape?.id
                            ? item.focusedIconUrl
                            : item.iconUrl,
                      }}
                      style={{
                        width: 25,
                        height: 25,
                        margin: 7.5,
                      }}
                    />
                  </Animated.View>
                );
              }}
            />
          ) : (
            <Image
              source={{ uri: shape?.focusedIconUrl }}
              style={{
                width: 25,
                height: 25,
              }}
            />
          )}
        </Animated.View>
      </View>
    </Portal>
  );
};

export default ShapeMenu;

const styles = StyleSheet.create({});
