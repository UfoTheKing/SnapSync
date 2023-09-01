import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SquareFourStyles } from "../styles";
import TopLeft from "./TopLeft";
import TopRight from "./TopRight";
import BottomLeft from "./BottomLeft";
import BottomRight from "./BottomRight";

type Props = {};

const SquareFour = (props: Props) => {
  return (
    <View style={SquareFourStyles.container}>
      <View style={SquareFourStyles.top}>
        <TopLeft />
        <TopRight />
      </View>
      <View style={SquareFourStyles.bottom}>
        <BottomLeft />
        <BottomRight />
      </View>
    </View>
  );
};

export default SquareFour;

const styles = StyleSheet.create({});
