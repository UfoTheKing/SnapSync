import { StyleSheet, View } from "react-native";
import React from "react";
import { Shape } from "@/models/project/Shape";
import SnapSyncGridCell from "../SnapSyncGridCell/SnapSyncGridCell";

type Props = {
  shape: Shape;
  cWidth: number;
  cHeight: number;

  handlePressAddUser?: (position: string) => void;
};

const SnapSyncGrid = (props: Props) => {
  const { shape, cHeight, cWidth, handlePressAddUser } = props;
  const { grid } = shape;

  return (
    <View
      style={{
        width: cWidth,
        height: cHeight,
      }}
    >
      {grid.map((row, i) => {
        let rowColunm = row.length;
        return (
          <View style={styles.row} key={i}>
            {row.map((cell, j) => {
              return (
                <SnapSyncGridCell
                  rowColunm={rowColunm}
                  shape={shape}
                  cWidth={cWidth}
                  cHeight={cHeight}
                  key={j}
                  position={cell}
                  rIndex={i}
                  cIndex={j}
                  handlePress={() => handlePressAddUser?.(cell)}
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default SnapSyncGrid;

const styles = StyleSheet.create({
  grid: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "black",
  },
  row: {
    flexDirection: "row",
  },
});
