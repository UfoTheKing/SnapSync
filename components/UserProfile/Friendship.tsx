import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FriendshipStatus } from "@/models/resources/User";
import { ScreenWidth } from "@/constants/Layout";
import { AntDesign } from "@expo/vector-icons";
import { Button, Icon } from "native-base";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  friendshipStatus?: FriendshipStatus;
  isLoading?: boolean;
  isRefetching?: boolean;

  fullName: string;

  accept: () => void;
  reject: () => void;
  destroy: () => void;
};

const Friendship = (props: Props) => {
  const {
    friendshipStatus,
    isLoading = false,
    isRefetching = false,
    fullName,
  } = props;

  if (!friendshipStatus) return null;

  if (friendshipStatus?.isBlocking) {
    return null;
  } else if (friendshipStatus?.isFriend) {
    return null;
  } else if (friendshipStatus?.incomingRequest) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: "#e7e7e7",
            // justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            padding: 16,
          },
        ]}
      >
        <Text style={styles.text}>{fullName} sent you a friend request</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              colorScheme="primary"
              size="sm"
              rounded="full"
              isLoading={isLoading || isRefetching}
              onPress={props.accept}
              _text={{
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
              leftIcon={
                <Icon as={AntDesign} name="adduser" size={4} color="white" />
              }
            >
              Accept
            </Button>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              colorScheme="error"
              size="sm"
              rounded="full"
              isLoading={isLoading || isRefetching}
              onPress={props.reject}
              _text={{
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
              leftIcon={
                <Icon as={AntDesign} name="deleteuser" size={4} color="white" />
              }
              style={{ marginLeft: 10 }}
            >
              Reject
            </Button>
          </View>
        </View>
      </View>
    );
  } else if (friendshipStatus?.outgoingRequest) {
    return (
      <View style={styles.container}>
        <Button
          colorScheme="secondary"
          size="sm"
          rounded="full"
          disabled
          isLoading={isLoading || isRefetching}
          onPress={props.destroy}
          _text={{
            fontWeight: "bold",
            letterSpacing: 0.5,
          }}
          leftIcon={
            <Icon as={AntDesign} name="adduser" size={4} color="white" />
          }
          style={{
            opacity: 0.5,
          }}
        >
          Wait
        </Button>
        <TouchableOpacity>
          <Text
            style={{
              color: "#3182ce",
              fontSize: 12,
              fontWeight: "bold",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Cancel friendship request
          </Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Button
          colorScheme="secondary"
          size="md"
          rounded="full"
          isLoading={isLoading || isRefetching}
          //   onPress={() => {}}
          _text={{
            fontWeight: "bold",
            letterSpacing: 0.5,
          }}
          leftIcon={
            <Icon as={AntDesign} name="adduser" size={4} color="white" />
          }
        >
          Add
        </Button>
      </View>
    );
  }
};

export default Friendship;

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: ScreenWidth - 50,
  },

  text: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
