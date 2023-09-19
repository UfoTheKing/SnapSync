import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { AVATAR_SIZE } from "../styles";
import { Skeleton } from "native-base";
import { LightBackground } from "@/utils/theme";

type Props = {
  profilePictureUrl?: string;
  isLoading?: boolean;
  size?: number;

  isJoined?: boolean;
  showStatus?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
};

const Avatar = (props: Props) => {
  const {
    profilePictureUrl,
    isLoading = false,
    size = AVATAR_SIZE,
    isJoined = false,
    showStatus = false,
  } = props;
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        props.containerStyle,
      ]}
    >
      {isLoading ? (
        <Skeleton height={size} width={size} borderRadius="full" />
      ) : profilePictureUrl ? (
        <Image
          source={{ uri: profilePictureUrl }}
          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 100 }}
        />
      ) : null}

      {isJoined && showStatus && !isLoading && <View style={styles.status} />}
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: "#ccc",
  },
  status: {
    position: "absolute",
    bottom: -2.5,
    right: 0,
    width: 15,
    height: 15,
    borderRadius: 100,
    backgroundColor: "green",
    borderWidth: 1,
    borderColor: LightBackground,
  },
});
