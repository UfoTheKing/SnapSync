import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {};

const HomeScreen = (props: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>HomeScreen</Text>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
