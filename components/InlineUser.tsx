import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { ScreenWidth } from "@/constants/Layout";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "native-base";
import { AntDesign } from "@expo/vector-icons";

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

export const INLINE_USER_HEIGHT = 48;
export const AVATAR_SIZE = 42;

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

  const colors = useTheme().colors;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        style={[
          styles.container,
          { paddingHorizontal: ph, backgroundColor: bgc, marginTop: mt },
        ]}
      >
        <View style={styles.boxUserInfos}>
          <View style={styles.boxUserAvatar}>
            <Image
              source={{ uri: profilePictureUrl }}
              style={{ ...StyleSheet.absoluteFillObject, borderRadius: 100 }}
            />
          </View>
          <View style={styles.boxUserInfo}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {username}
              </Text>
              {isVerified ? (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary[900]}
                  style={{ marginLeft: 4 }}
                />
              ) : (
                <></>
              )}
            </View>
            <Text style={{ fontSize: 12, color: colors.gray[500] }}>
              {fullName}
            </Text>
            {contact && showContact ? (
              <View style={styles.boxFromMyContacts}>
                <AntDesign name="contacts" size={8} color={colors.gray[500]} />
                <Text
                  style={{
                    fontSize: 10,
                    color: colors.gray[500],
                    marginLeft: 4,
                  }}
                >
                  Contact
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        {props.rightComponent ? props.rightComponent : <></>}
      </View>
    </TouchableOpacity>
  );
};

export default InlineUser;

const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: INLINE_USER_HEIGHT,
  },
  boxUserInfos: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  boxUserAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 100,
  },
  boxUserInfo: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 12,
  },
  boxFromMyContacts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
