import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { FeedComment } from "@/models/project/Feed";
import Avatar from "../User/Avatar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Verified from "../User/Verified";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { LikeComment, UnlikeComment } from "@/api/routes/comments.route";

type Props = {
  item: FeedComment;

  mode?: "default" | "inline";

  showLikesCount?: boolean;
  onPressLikesCount?: () => void;

  showReply?: boolean;
  onPressReply?: () => void;

  showLike?: boolean;
};

const Comment = (props: Props) => {
  const insets = useSafeAreaInsets();

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  const {
    mode = "default",
    showLikesCount = true,
    showReply = true,
    showLike = true,
  } = props;

  const likeMutation = useMutation(
    (commentId: number) => LikeComment(commentId, tokenApi),
    {
      onSuccess: (data) => {
        props.item.hasLikedComment = true;
        props.item.likesCount += 1;
      },
    }
  );

  const unlikeMutation = useMutation(
    (commentId: number) => UnlikeComment(commentId, tokenApi),
    {
      onSuccess: (data) => {
        props.item.hasLikedComment = false;
        props.item.likesCount -= 1;
      },
    }
  );

  const handlePressLikeAndUnlike = () => {
    if (props.item.hasLikedComment) {
      unlikeMutation.mutate(props.item.id);
    } else {
      likeMutation.mutate(props.item.id);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingLeft: insets.left === 0 ? 10 : insets.left,
          paddingRight: insets.right === 0 ? 10 : insets.right,
        },
      ]}
    >
      <View
        style={{
          flex: 2,
          alignItems: mode === "default" ? "center" : "flex-start", // 'flex-start
          justifyContent: "center",
          minHeight: 30,
        }}
      >
        {mode == "default" ? (
          <Avatar
            profilePictureUrl={props.item.user.profilePictureUrl}
            size={22}
          />
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.username}>{props.item.user.username}</Text>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 9,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: 30,
        }}
      >
        {mode === "default" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.username}>{props.item.user.username}</Text>
            {props.item.user.isVerified && <Verified size={12} />}
          </View>
        )}
        <Text style={styles.text}>{props.item.text}</Text>
        {mode === "default" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {showLikesCount && props.item.likesCount > 0 && (
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={props.onPressLikesCount}>
                  <Text style={styles.textLikesAndReply}>
                    {props.item.likesCount}{" "}
                    {props.item.likesCount > 1 ? "likes" : "like"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {showLikesCount && props.item.likesCount > 0 && showReply && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    styles.textLikesAndReply,
                    {
                      marginHorizontal: 10,
                    },
                  ]}
                >
                  •
                </Text>
              </View>
            )}
            {showReply && (
              <View
                style={{
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity onPress={props.onPressReply}>
                  <Text style={styles.textLikesAndReply}>Reply</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
      {showLike && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            minHeight: 30,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity onPress={handlePressLikeAndUnlike}>
            {props.item.hasLikedComment ? (
              <AntDesign name="heart" size={12} color="red" />
            ) : (
              <AntDesign name="hearto" size={12} color="black" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  username: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#000",
    letterSpacing: 0.5,
    // lineHeight: 14,
  },
  text: {
    fontSize: 12,
    color: "#000",
    letterSpacing: 0.5,
    // lineHeight: 14,
  },
  textLikesAndReply: {
    fontSize: 8,
    letterSpacing: 0.5,
    lineHeight: 14,
    color: "gray",
  },
});
