import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { FEED_HEADER_HEIGHT, FEED_HEADER_PADDING_X } from "./styles";

import { FeedUser } from "@/models/project/Feed";
import { SnapPositions, SnapShapeNames } from "@/utils/shapes";
import Avatar from "../User/Avatar";
import Info from "../User/Info";
import { SmallUser } from "@/models/resources/User";
import { SmallSnapShape } from "@/models/resources/SnapShape";

type Props = {
  users: FeedUser[];
  shape: SmallSnapShape;

  onPressUser?: (user: SmallUser) => void;
};

const FeedTopHeader = (props: Props) => {
  const { users, shape } = props;

  const topLeftUser =
    shape.name === SnapShapeNames.SquareFour
      ? users.find((user) => user.position.name === SnapPositions.TopLeft)
      : shape.name === SnapShapeNames.RectTwo
      ? users.find((user) => user.position.name === SnapPositions.FullLeft)
      : undefined;

  const topRightUser =
    shape.name === SnapShapeNames.SquareFour
      ? users.find((user) => user.position.name === SnapPositions.TopRight)
      : undefined;

  return (
    <View
      style={{
        ...FeedHeaderStyle.container,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: FEED_HEADER_PADDING_X,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          if (props.onPressUser && topLeftUser)
            props.onPressUser(topLeftUser.user);
        }}
        disabled={!topLeftUser}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar profilePictureUrl={topLeftUser?.user.profilePictureUrl} />
          <Info
            username={topLeftUser?.user.username}
            fullName={topLeftUser?.subtitle}
            isVerified={topLeftUser?.user.isVerified}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (props.onPressUser && topRightUser)
            props.onPressUser(topRightUser.user);
        }}
        disabled={!topRightUser}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {topRightUser && (
            <>
              <Info
                username={topRightUser?.user.username}
                fullName={topRightUser?.subtitle}
                isVerified={topRightUser?.user.isVerified}
              />
              <Avatar
                profilePictureUrl={topRightUser?.user.profilePictureUrl}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FeedTopHeader;

const FeedHeaderStyle = StyleSheet.create({
  container: {
    width: "100%",
    height: FEED_HEADER_HEIGHT,
    marginVertical: 8,
  },
});
