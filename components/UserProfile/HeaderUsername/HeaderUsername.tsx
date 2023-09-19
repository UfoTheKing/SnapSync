import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UserProfile } from "@/models/project/UserProfile";
import Verified from "@/components/User/Verified/Verified";

type Props = {
  username?: string;
  isVerified?: boolean;
  userProfile?: UserProfile;
};

const HeaderUsername = (props: Props) => {
  const { username, isVerified, userProfile } = props;

  const renderHeaderUsernameText = () => {
    if (userProfile) {
      if (userProfile.username.length > 25) {
        return userProfile.username.slice(0, 25) + "...";
      } else {
        return userProfile.username;
      }
    } else if (username) {
      if (username.length > 25) {
        return username.slice(0, 25) + "...";
      } else {
        return username;
      }
    }

    return "";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{renderHeaderUsernameText()}</Text>
      {userProfile ? (
        userProfile.isVerified ? (
          <Verified />
        ) : null
      ) : isVerified ? (
        <Verified />
      ) : null}
    </View>
  );
};

export default HeaderUsername;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 28,
    marginRight: 4,
  },
});
