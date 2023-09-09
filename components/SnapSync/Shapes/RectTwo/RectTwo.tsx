import { Text, View } from "react-native";
import React from "react";
import { RectTwoStyles } from "../styles";
import { Shape } from "@/models/project/Shape";
import FullLeft from "./FullLeft";
import FullRight from "./FullRight";
import { CameraType, FlashMode } from "expo-camera";
import { Positions } from "@/utils/positions";

type Props = {
  shape: Shape;
  onPressInvite: (position: string) => void;

  cameraType: CameraType;
  flashMode: FlashMode;

  isTimerCompleted: boolean;
};

const RectTwo = (props: Props) => {
  return (
    <View style={RectTwoStyles.container}>
      <FullLeft
        cameraType={props.cameraType}
        flashMode={props.flashMode}
        isTimerCompleted={props.isTimerCompleted}
        onPictureTaken={(uri) => {
          console.log("uri", uri);
        }}
      />
      <FullRight
        onPressInvite={() => props.onPressInvite(Positions.FullRight)}
      />
    </View>
  );
};

export default RectTwo;
