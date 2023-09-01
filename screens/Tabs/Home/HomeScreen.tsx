import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { HomeStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";

type Props = {};

const HomeScreen = ({ navigation }: HomeStackScreenProps<"Home">) => {
  const ws = useSelector((state: RootState) => state.socket.ws);

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>HomeScreen</Text>

      <View style={{ ...styles.snapSyncContainer, bottom: insets.bottom }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SnapSyncStack", {
              screen: "Create",
              params: {
                createdByMe: true,
              },
            })
          }
        >
          <View style={styles.button}>
            <AntDesign name="sync" size={24} color="#e7e7e7" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  snapSyncContainer: {
    position: "absolute",
    // left: 0,
    // right: 0,
    alignItems: "center",
  },
  button: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    backgroundColor: "#fff",
    borderWidth: 10,
    borderColor: "#e7e7e7",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,

    alignItems: "center",
    justifyContent: "center",
  },
});
