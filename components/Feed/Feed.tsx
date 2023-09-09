import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
} from "react-native";
import React, { useCallback, useRef } from "react";
import { Feed as IFeed } from "@/models/project/Feed";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenWidth } from "@/constants/Layout";
import FeedBottomHeader from "./FeedBottomHeader";
import FeedTopHeader from "./FeedTopHeader";
import { FEED_HEADER_HEIGHT } from "./styles";
import { SmallUser } from "@/models/resources/User";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../BottomSheetModal/CustomBackdrop";
import BottomSheetModalHeader from "../BottomSheetModal/BottomSheetModalHeader";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { Input } from "native-base";
import FeedFooter from "./FeedFooter";
import { useQuery } from "react-query";

type Props = {
  item: IFeed;
  handlePressUser?: (user: SmallUser) => void;
};

const Feed = (props: Props) => {
  const { item, handlePressUser } = props;

  const user = useSelector((state: RootState) => state.user.user);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = React.useMemo(() => ["50%", "80%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const renderBackdrop = React.useCallback(
    (props: any) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        onPress={handleDismissModalPress}
      />
    ),
    []
  );

  // TODO
  // const {
  //   data: comments,
  //   isLoading: commentsLoading,
  //   error: commentsError,
  //   isError: commentsIsError,
  // } = useQuery(["feed", item.id, "comments", tokenApi]);

  const width = React.useMemo(() => {
    return ScreenWidth - insets.left - insets.right - 25;
  }, [insets.left, insets.right]);

  const height = React.useMemo(() => {
    let originalRatio = item.originalHeight / item.originalWidth;
    return width * originalRatio;
  }, [item.originalHeight, item.originalWidth, width]);

  return (
    <View style={styles.container}>
      <FeedTopHeader
        users={item.users}
        shape={item.shape}
        onPressUser={(u) => {
          if (handlePressUser) handlePressUser(u);
        }}
      />

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width,
            height,
            borderRadius: 16,
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{
              ...StyleSheet.absoluteFillObject,
              borderRadius: 16,
            }}
          />
        </View>
      </View>

      <FeedBottomHeader
        users={item.users}
        shape={item.shape}
        onPressUser={handlePressUser}
      />

      <FeedFooter item={item} onPress={handlePresentModalPress} />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // footerComponent={renderFooter}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "height" : "height"}
          keyboardVerticalOffset={150 - insets.bottom}
          style={{ flex: 1 }}
          onTouchStart={() => Keyboard.dismiss()}
        >
          <BottomSheetModalHeader
            title="Comments"
            subitle={item.commentsCount + " comments"}
            showDivider={true}
            showCancel={true}
            onPressCancel={handleDismissModalPress}
          />
          {/* <FlatList
            data={comments}
            renderItem={({ item }) => {
              return <Text style={{ color: "black" }}>{item.text}</Text>;
            }}
            keyExtractor={(item) => item.pk}
          /> */}
          <View
            style={{
              height: 150,
              borderTopWidth: 0.5,
              borderTopColor: "#d3d3d3",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              // marginBottom: 100,
            }}
          >
            <View
              style={{
                flex: 2,
                height: 150,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "red",
              }}
            >
              <Image
                source={{
                  uri: user?.profilePictureUrl,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />
            </View>
            {/* <View
              style={{
                flex: 6,
                height: 150,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "blue",
              }}
            >
              <Input
                variant="filled"
                placeholder="Add a comment..."
                placeholderTextColor={PlaceHolderColor}
                style={{
                  width: "100%",
                  height: 50,
                  backgroundColor: "transparent",
                  color: "#000",
                  fontSize: 16,
                }}
                rounded={15}
                value={comment}
                onChangeText={(text) => setComment(text)}
              />
            </View>
            <View
              style={{
                flex: 1,
                height: 150,
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "green",
              }}
            >
              <IconButton
                variant="solid"
                rounded={100}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size="sm"
                isDisabled={comment.length === 0}
                onPress={() => {
                  console.log("comment", comment);
                }}
              >
                <FontAwesome name="send" size={16} color="black" />
              </IconButton>
            </View> */}
          </View>
        </KeyboardAvoidingView>
      </BottomSheetModal>
    </View>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  header: {
    height: FEED_HEADER_HEIGHT,
    width: "100%",
    backgroundColor: "blue",
  },
});
