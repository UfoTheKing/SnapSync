import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Skeleton, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { INLINE_USER_HEIGHT } from "../styles";

type Props = {
  username?: string;
  isVerified?: boolean;
  fullName?: string;

  isContact?: boolean;
  showContact?: boolean;

  isLoading?: boolean;
};

const Info = (props: Props) => {
  const {
    username,
    isVerified,
    fullName,
    isContact = false,
    showContact = false,

    isLoading = false,
  } = props;

  const colors = useTheme().colors;

  return (
    <View style={styles.container}>
      <View style={styles.usernameAndIsVerified}>
        {isLoading ? (
          <Skeleton h="3" rounded="md" />
        ) : (
          <>
            <Text style={styles.username}>
              {username
                ? username.length > 15
                  ? username.slice(0, 15) + "..."
                  : username
                : ""}
            </Text>
            {isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.primary[900]}
                style={{ marginLeft: 4 }}
              />
            )}
          </>
        )}
      </View>
      {isLoading ? (
        <Skeleton h="3" rounded="md" mt={1} />
      ) : (
        <Text style={{ fontSize: 12, color: colors.gray[500] }}>
          {fullName && fullName.length > 14
            ? fullName.slice(0, 14) + "..."
            : fullName}
        </Text>
      )}
      {isContact && showContact ? (
        <View style={styles.boxFromMyContacts}>
          <AntDesign name="contacts" size={8} color={colors.gray[500]} />
          <Text
            style={{
              fontSize: 10,
              color: colors.gray[500],
              marginLeft: 4,
            }}
          >
            Contact
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: INLINE_USER_HEIGHT,
    paddingHorizontal: 12,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  usernameAndIsVerified: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
  },
  boxFromMyContacts: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
