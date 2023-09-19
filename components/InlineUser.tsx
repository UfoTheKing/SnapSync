import {
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { INLINE_USER_HEIGHT } from "./User/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "./User/Avatar/Avatar";
import Info from "./User/Info/Info";

type Props = {
  username: string;
  fullName: string;
  profilePictureUrl: string;
  isVerified: boolean;

  rightComponent?: React.ReactNode;

  containerStyle?: StyleProp<ViewStyle>;

  onPress?: () => void;
  disabled?: boolean;

  contact?: boolean;
  showContact?: boolean;
};

const InlineUser = (props: Props) => {
  const {
    username,
    fullName,
    profilePictureUrl,
    isVerified,
    containerStyle,

    onPress,
    disabled = false,

    contact = false,
    showContact = false,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      onLongPress={() => {
        console.log("long press");
      }}
    >
      <View style={[styles.container, containerStyle]}>
        <View style={styles.boxUserInfos}>
          <Avatar profilePictureUrl={profilePictureUrl} />
          <Info
            username={username}
            fullName={fullName}
            isVerified={isVerified}
            isContact={contact}
            showContact={showContact}
          />
        </View>
        <View style={styles.boxRightComponent}>{props.rightComponent}</View>
      </View>
    </TouchableOpacity>
  );
};

export default InlineUser;

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
  },
});
