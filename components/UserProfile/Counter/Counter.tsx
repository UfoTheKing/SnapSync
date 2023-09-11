import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import {} from "react-native-gesture-handler";

type Props = {
  friends: number;
  snaps: number;

  onPressFriends: () => void;
  disabledFriends: boolean;
};

const Counter = (props: Props) => {
  const { friends, snaps } = props;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(43, 51, 64, 1)", "rgba(43, 51, 64, 0.62)"]}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 16,
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 32,
        }}
      >
        <TouchableOpacity disabled={true}>
          <View style={styles.cell}>
            <Text style={styles.number}>{snaps}</Text>
            <Text style={styles.text}>Snaps</Text>
          </View>
        </TouchableOpacity>
        <View style={[styles.cell, styles.border]}></View>
        <TouchableOpacity
          onPress={props.onPressFriends}
          disabled={props.disabledFriends}
        >
          <View style={styles.cell}>
            <Text style={styles.number}>{friends}</Text>
            <Text style={styles.text}>Friends</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default Counter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 327,
    height: 72,
    borderRadius: 16,
    marginTop: 24,
  },
  cell: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    borderColor: "rgba(80, 90, 108, 1)",
    borderWidth: 1,
  },
  number: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    color: "#fff",
  },
  text: {
    color: "rgba(141, 146, 172, 1)",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
  },
});
