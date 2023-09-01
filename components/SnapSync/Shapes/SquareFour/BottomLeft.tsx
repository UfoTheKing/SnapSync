import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SquareFourStyles } from "../styles";

type Props = {};

const BottomLeft = (props: Props) => {
  return (
    <View style={SquareFourStyles.bottomLeft}>
      <Text>BottomLeft</Text>
    </View>
  );
};

export default BottomLeft;

const styles = StyleSheet.create({});
