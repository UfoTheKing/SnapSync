import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props extends BottomSheetBackdropProps {
  onPress: () => void;
}

const CustomBackdrop = ({ animatedIndex, style, onPress }: Props) => {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 0.5],
      Extrapolate.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [style, { backgroundColor: "#000" }, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View style={containerStyle} onTouchStart={onPress} />;
};

export default CustomBackdrop;
