import { Text, View } from "react-native";
import React from "react";
import { RectTwoStyles } from "../styles";
import { Shape } from "@/models/project/Shape";
import FullLeft from "./FullLeft";
import FullRight from "./FullRight";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";

type Props = {
  shape: Shape;
  onPressInvite: (position: string) => void;
};

const RectTwo = (props: Props) => {
  const users = useSelector((state: RootState) => state.snapSync.users);

  return (
    <View style={RectTwoStyles.container}>
      <FullLeft />
      <FullRight
        onPressInvite={() => props.onPressInvite("FULL_RIGHT")}
        user={users.find((user) => user.position === "FULL_RIGHT")}
      />
    </View>
  );
};

export default RectTwo;
