import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { FeedUser } from "@/models/project/Feed";
import { SnapPositions, SnapShapeNames } from "@/utils/shapes";
import Avatar from "../User/Avatar";
import Info from "../User/Info";
import { FEED_HEADER_HEIGHT, FEED_HEADER_PADDING_X } from "./styles";
import { SmallUser } from "@/models/resources/User";
import { SmallSnapShape } from "@/models/resources/SnapShape";

type Props = {
  users: FeedUser[];
  shape: SmallSnapShape;

  onPressUser?: (user: SmallUser) => void;
};

const FeedBottomHeader = (props: Props) => {
  const { users, shape } = props;

  const bottomLeftUser =
    shape.name === SnapShapeNames.SquareFour
      ? users.find((user) => user.position.name === SnapPositions.BottomLeft)
      : undefined;

  const bottomRightUser =
    shape.name === SnapShapeNames.SquareFour
      ? users.find((user) => user.position.name === SnapPositions.BottomRight)
      : shape.name === SnapShapeNames.RectTwo
      ? users.find((user) => user.position.name === SnapPositions.FullRight)
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
          if (props.onPressUser && bottomLeftUser)
            props.onPressUser(bottomLeftUser.user);
        }}
        disabled={!bottomLeftUser}
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
          {bottomLeftUser && (
            <>
              <Avatar
                profilePictureUrl={bottomLeftUser?.user.profilePictureUrl}
              />
              <Info
                username={bottomLeftUser?.user.username}
                fullName={bottomLeftUser?.subtitle}
                isVerified={bottomLeftUser?.user.isVerified}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (props.onPressUser && bottomRightUser)
            props.onPressUser(bottomRightUser.user);
        }}
        disabled={!bottomRightUser}
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
          <Info
            username={bottomRightUser?.user.username}
            fullName={bottomRightUser?.subtitle}
            isVerified={bottomRightUser?.user.isVerified}
          />
          <Avatar profilePictureUrl={bottomRightUser?.user.profilePictureUrl} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FeedBottomHeader;

const FeedHeaderStyle = StyleSheet.create({
  container: {
    width: "100%",
    height: FEED_HEADER_HEIGHT,
    marginVertical: 8,
  },
});
