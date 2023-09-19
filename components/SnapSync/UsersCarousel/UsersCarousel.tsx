import { StyleSheet, View } from "react-native";
import React from "react";
import Carousel from "react-native-reanimated-carousel";
import { ScreenWidth } from "@/constants/Layout";
import { Shape } from "@/models/project/Shape";
import { SnapSyncUser } from "@/models/wss/SnapSync";
import Avatar from "@/components/User/Avatar/Avatar";

type Props = {
  shape: Shape;
  users: SnapSyncUser[];
  showStatus: boolean;
};

const UsersCarousel = (props: Props) => {
  const { shape, users, showStatus } = props;
  return (
    <View style={styles.container}>
      <Carousel
        vertical={false}
        width={80}
        height={80}
        style={{
          width: ScreenWidth,
        }}
        loop={false}
        data={users}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar
              size={40}
              profilePictureUrl={item.profilePictureUrl}
              showStatus={showStatus}
              isJoined={item.isJoined}
            />
          </View>
        )}
      />
    </View>
  );
};

export default UsersCarousel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
