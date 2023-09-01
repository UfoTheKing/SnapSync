import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SquareFourStyles } from "../styles";

type Props = {};

const TopRight = (props: Props) => {
  return (
    <View style={SquareFourStyles.topRight}>
      <Text>TopRight</Text>
    </View>
  );
};

export default TopRight;

const styles = StyleSheet.create({});
