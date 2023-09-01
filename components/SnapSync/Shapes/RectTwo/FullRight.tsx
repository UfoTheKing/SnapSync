import { StyleSheet, View, Image } from "react-native";
import React from "react";
import { RectTwoStyles } from "../styles";
import { SnapSyncUser } from "@/business/redux/features/snapsync/snapSyncSlice";
import LottieView from "lottie-react-native";
import { Button } from "native-base";

type Props = {
  user?: SnapSyncUser;
  onPressInvite: () => void;
};

const FullRight = (props: Props) => {
  const { user, onPressInvite } = props;

  return (
    <View style={RectTwoStyles.right}>
      {user ? (
        <View>
          <Image
            source={{ uri: user.profilePictureUrl }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
          {!user.joined && (
            <LottieView
              source={require("../../../../assets/animations/loading.json")}
              autoPlay
              loop={true}
              style={{ width: 50, height: 50, position: "absolute" }}
            />
          )}
        </View>
      ) : (
        <Button
          colorScheme="primary"
          size="sm"
          rounded="full"
          onPress={onPressInvite}
          _text={{
            fontWeight: "bold",
            letterSpacing: 0.5,
          }}
        >
          Invite
        </Button>
      )}
    </View>
  );
};

export default FullRight;

const styles = StyleSheet.create({});
