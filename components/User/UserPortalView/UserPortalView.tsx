import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState } from "react";
import { Portal } from "react-native-portalize";
import { BlurView } from "expo-blur";
import { INLINE_USER_HEIGHT } from "../styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWidth } from "@/constants/Layout";

type Props = {
  userId: number;
  coordinates: { x: number; y: number };
  onDismiss: () => void;
};

const UserPortalView = (props: Props) => {
  const { userId, coordinates, onDismiss } = props;

  const insets = useSafeAreaInsets();

  const [height] = useState(new Animated.Value(INLINE_USER_HEIGHT));

  React.useEffect(() => {
    Animated.timing(height, {
      toValue: 350,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <Portal>
      <BlurView tint="dark" intensity={50} style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={onDismiss}
        >
          <Animated.View
            style={[
              styles.container,
              {
                height: height,
                top: coordinates.y,
                position: "absolute",
                width: ScreenWidth - 15,
              },
            ]}
          >
            <Text>
              {coordinates.x} {coordinates.y}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Portal>
  );
};

export default UserPortalView;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: "white",
  },
});
