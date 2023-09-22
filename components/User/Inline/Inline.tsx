import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import { INLINE_USER_HEIGHT, RIGHT_COMPONENT_MAX_WIDTH } from "../styles";
import Avatar from "../Avatar/Avatar";
import Info from "../Info/Info";

type Props = {
  user: {
    username: string;
    fullName: string;
    profilePictureUrl: string;
    isVerified: boolean;

    streak?: number;
  };

  rightComponent?: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;

  onPress?: () => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
};

const Inline = (props: Props) => {
  const {
    user: { username, fullName, profilePictureUrl, isVerified, streak },
    containerStyle,
    onPress,
    onLongPress,
    disabled = false,
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      onLongPress={onLongPress}
    >
      <View style={[styles.container, containerStyle]}>
        <View style={styles.boxUserInfos}>
          <Avatar profilePictureUrl={profilePictureUrl} />
          <Info
            username={username}
            fullName={fullName}
            isVerified={isVerified}
            streak={streak}
            sliceText={props.rightComponent !== undefined}
          />
        </View>
        <View style={styles.boxRightComponent}>{props.rightComponent}</View>
      </View>
    </TouchableOpacity>
  );
};

export default Inline;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: INLINE_USER_HEIGHT,
    backgroundColor: "white",
  },
  boxUserInfos: {
    flexDirection: "row",
    alignItems: "center",
    // padding: 5,
    flex: 2,
    height: INLINE_USER_HEIGHT,
    // backgroundColor: "blue",
  },
  boxRightComponent: {
    height: INLINE_USER_HEIGHT,
    flex: 1,
    maxWidth: RIGHT_COMPONENT_MAX_WIDTH,
    zIndex: 99,
    elevation: 99,
  },
});
