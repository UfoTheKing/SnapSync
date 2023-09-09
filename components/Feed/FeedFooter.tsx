import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { FEED_FOOTER_MAX_HEIGHT } from "./styles";
import { Feed } from "@/models/project/Feed";
import Comment from "./Comment";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PreviewComment from "./PreviewComment";

type Props = {
  item: Feed;
  onPress?: () => void;
};

const FeedFooter = (props: Props) => {
  const { item } = props;

  const insets = useSafeAreaInsets();

  const commentsCount = React.useMemo(() => {
    return item.commentsCount - item.comments.length;
  }, [item.comments, item.commentsCount]);

  return (
    <View style={styles.container}>
      {commentsCount > 0 ? (
        <View
          style={{
            paddingLeft: insets.left === 0 ? 10 : insets.left,
            alignItems: "flex-start",
            justifyContent: "center",
            minHeight: 30,
          }}
        >
          <TouchableOpacity onPress={props.onPress}>
            <Text style={styles.commentsCountText}>
              Show all and {commentsCount}{" "}
              {commentsCount > 1 ? "comments" : "comment"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {item.comments.map((comment, index) => {
        return <PreviewComment item={comment} key={index} />;
      })}
    </View>
  );
};

export default FeedFooter;

const styles = StyleSheet.create({
  container: {
    maxHeight: FEED_FOOTER_MAX_HEIGHT,
    height: FEED_FOOTER_MAX_HEIGHT,
    width: "100%",
    marginVertical: 5,
  },
  commentsCountText: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
    letterSpacing: 1,
    lineHeight: 14,
  },
});
