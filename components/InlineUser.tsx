import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import React from "react";
import { ScreenWidth } from "@/constants/Layout";
import Avatar from "./User/Avatar";
import Info from "./User/Info";
import { INLINE_USER_HEIGHT } from "./User/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  username: string;
  fullName: string;
  profilePictureUrl: string;
  isVerified: boolean;

  bgc?: string;
  rightComponent?: React.ReactNode;
  ph?: number;
  mt?: number;

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
    bgc = "#fff",
    ph = 0,
    mt = 0,

    onPress,
    disabled = false,

    contact = false,
    showContact = false,
  } = props;

  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.container,
          { paddingHorizontal: ph, backgroundColor: bgc, marginTop: mt },
        ]}
      >
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
