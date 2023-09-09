import { StyleSheet, Image, View } from "react-native";
import React from "react";
import { AVATAR_SIZE } from "./styles";
import { Skeleton } from "native-base";

type Props = {
  profilePictureUrl?: string;
  isLoading?: boolean;
  size?: number;
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
    // width: AVATAR_SIZE,
    // height: AVATAR_SIZE,
    borderRadius: 100,
    backgroundColor: "#c2c2c2",
  },
});
