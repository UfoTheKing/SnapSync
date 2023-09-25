import { StyleSheet, Image, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { VStack } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { HEADER_HEIGHT } from "./styles";

type Props = {
  animatedValue: SharedValue<number>;
  onPressFriends: () => void;
  onPressProfile: () => void;
};

const AnimatedHeader = (props: Props) => {
  const { animatedValue } = props;

  const user = useSelector((state: RootState) => state.user.user);

  const insets = useSafeAreaInsets();

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(
            animatedValue.value,
            {
              duration: 200,
              easing: Easing.linear,
            },
            () => {
              // console.log("done");
            }
          ),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT + insets.top,
          backgroundColor: "white",
          zIndex: 3,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#f7f7f7",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        headerStyle,
      ]}
    >
      <View
        style={{
          flex: 1,
          height: "100%",
          //justifyContent: "center",
          alignItems: "flex-start",
          marginLeft: insets.left + 10,
          paddingTop: insets.top,
        }}
      >
        <TouchableOpacity
          style={{
            marginLeft: 10,
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={props.onPressFriends}
        >
          <VStack
            style={{
              width: 30,
              height: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name="user-friends" size={24} color="black" />
          </VStack>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          paddingTop: insets.top,
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://1000marche.net/wp-content/uploads/2020/03/Instagram-Logo-2010-2013.png",
          }}
          style={{
            width: 100,
            height: 30,
            resizeMode: "contain",
          }}
        />
      </View>
      <View
        style={{
          flex: 1,
          height: "100%",
          paddingTop: insets.top,
          alignItems: "flex-end",
          marginRight: insets.right + 10,
        }}
      >
        <TouchableOpacity onPress={props.onPressProfile}>
          <View
            style={{
              width: 30,
              height: 30,
              marginRight: 10,
              borderRadius: 15,
              backgroundColor: "#f7f7f7",
            }}
          >
            {user && user.profilePictureUrl ? (
              <Image
                source={{
                  uri: user.profilePictureUrl,
                }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderRadius: 15,
                }}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default AnimatedHeader;

const styles = StyleSheet.create({});
