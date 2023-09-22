import { StyleProp, StyleSheet, View, ViewStyle, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { AVATAR_SIZE } from "../styles";
import { Skeleton } from "native-base";
import { LightBackground } from "@/utils/theme";

type Props = {
  profilePictureUrl?: string;
  isLoading?: boolean;
  size?: number;

  containerStyle?: StyleProp<ViewStyle>;

  streak?: number;
  showStreak?: boolean;
};

const Avatar = (props: Props) => {
  const { profilePictureUrl, isLoading = false, size = AVATAR_SIZE } = props;

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
    </View>
  );
};

export default Avatar;

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: "#ccc",
  },
});
