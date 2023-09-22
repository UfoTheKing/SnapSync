import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  streak: number;
};

const Streak = (props: Props) => {
  const { streak } = props;

  return (
    <View style={styles.container}>
      <Text>{streak}</Text>
      <AntDesign name="disconnect" size={24} color="black" />
    </View>
  );
};

export default Streak;

const styles = StyleSheet.create({
  container: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
