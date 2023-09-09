import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { FeedComment } from "@/models/project/Feed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FeedStyles } from "./styles";
import { useMutation } from "react-query";
import { LikeComment, UnlikeComment } from "@/api/routes/comments.route";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  item: FeedComment;
};

const PreviewComment = (props: Props) => {
  const { item } = props;

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  const insets = useSafeAreaInsets();

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
      <View style={FeedStyles.containerUsername}>
        <Text style={FeedStyles.username}>{item.user.username}</Text>
      </View>
      <View style={FeedStyles.containerText}>
        <Text style={FeedStyles.text}>{item.text}</Text>
      </View>
      <View style={FeedStyles.containerLike}>
        <TouchableOpacity onPress={handlePressLikeAndUnlike}>
          {props.item.hasLikedComment ? (
            <AntDesign name="heart" size={12} color="red" />
          ) : (
            <AntDesign name="hearto" size={12} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PreviewComment;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 20,
  },
});
