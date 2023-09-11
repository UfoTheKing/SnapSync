import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Shape } from "@/models/project/Shape";

type Props = {
  shape: Shape | null;

  isOpen: boolean;
};

const ShapeMenu = (props: Props) => {
  const { shape } = props;
  return (
    <View style={styles.container}>
      {shape ? (
        <Image
          source={{ uri: shape.focusedIconUrl }}
          style={{
            width: 35,
            height: 35,
          }}
        />
      ) : null}
    </View>
  );
};

export default ShapeMenu;

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    backgroundColor: "#f7f7f7",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",

    borderColor: "#d2d2d2",
    borderWidth: 1,
  },
});
