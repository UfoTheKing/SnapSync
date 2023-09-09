import { StyleSheet, View } from "react-native";
import React from "react";
import Avatar from "../User/Avatar";
import { FEED_HEADER_HEIGHT, FEED_HEADER_PADDING_X } from "./styles";
import Info from "../User/Info";
import { Skeleton } from "native-base";

type Props = {};

const FeedSkeleton = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar isLoading />
          <Info isLoading />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Info isLoading />
          <Avatar isLoading />
        </View>
      </View>
      <View style={styles.containerImage}>
        <Skeleton height={300} width="100%" borderRadius={16} />
      </View>
      <View style={styles.header}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar isLoading />
          <Info isLoading />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Info isLoading />
          <Avatar isLoading />
        </View>
      </View>
    </View>
  );
};

export default FeedSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  header: {
    height: FEED_HEADER_HEIGHT,
    marginVertical: 8,
    paddingHorizontal: FEED_HEADER_PADDING_X,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  containerImage: {
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
});
