import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { MutualFriends as IMutualFriends } from "@/models/project/UserProfile";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  username?: string;
  mutualFriends?: IMutualFriends;
};

const SIZE = 20;

const MutualFriends = (props: Props) => {
  const insets = useSafeAreaInsets();

  const text = React.useMemo(() => {
    let nCount = props.mutualFriends ? props.mutualFriends.nodes.length : 0;
    let more = props.mutualFriends ? props.mutualFriends.count - nCount : 0;

    let r = props.mutualFriends?.nodes
      .map((friend) => friend.username)
      .join(", ");

    if (more > 0) r += ` and ${more} more`;

    r += `are friends with ${props.username}`;

    return r;
  }, []);

  if (!props.mutualFriends) return null;
  if (props.mutualFriends.count === 0) return null;

  return (
    <View style={styles.container}>
      {props.mutualFriends?.nodes.map((friend, index) => {
        return (
          <View
            key={index}
            style={{
              position: "relative",
              left: -index * 15,
              zIndex: 100 - index,
              width: SIZE,
              height: SIZE,
            }}
          >
            <Image
              source={{ uri: friend.profilePictureUrl }}
              style={{
                width: SIZE,
                height: SIZE,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#f7f7f7",
              }}
            />
          </View>
        );
      })}
      <Text
        style={[
          styles.text,
          {
            left: -props.mutualFriends.nodes.length * 10,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

export default MutualFriends;

const styles = StyleSheet.create({
  container: {
    marginTop: 2,
    height: 50,
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    maxWidth: 327,
  },
  text: {
    // marginLeft: 20,
    fontSize: 8,
    fontWeight: "400",
    lineHeight: 18,
    position: "relative",
  },
});
