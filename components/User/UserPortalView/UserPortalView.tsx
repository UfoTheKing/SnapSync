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
import Avatar from "../Avatar/Avatar";

type Props = {
  coordinates: { x: number; y: number };
  onDismiss: () => void;

  user: {
    id: number;
    profilePictureUrl: string;
    username: string;
    fullName: string;
  };
};

const UserPortalView = (props: Props) => {
  const { coordinates, onDismiss, user } = props;

  const insets = useSafeAreaInsets();

  const [height] = useState(new Animated.Value(INLINE_USER_HEIGHT));

  // React.useEffect(() => {
  //   Animated.timing(height, {
  //     toValue: 350,
  //     duration: 250,
  //     useNativeDriver: false,
  //   }).start();
  // }, []);

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
                height: INLINE_USER_HEIGHT,
                top: coordinates.y,
                position: "absolute",
                width: ScreenWidth,
                paddingHorizontal: 15,
                justifyContent: "center",
              },
            ]}
          >
            <Avatar profilePictureUrl={user.profilePictureUrl} />
          </Animated.View>
        </TouchableOpacity>
      </BlurView>
    </Portal>
  );
};

export default UserPortalView;

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    backgroundColor: "white",
  },
});
