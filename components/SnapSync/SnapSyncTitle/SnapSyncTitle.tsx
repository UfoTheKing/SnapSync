import { StyleSheet, Text } from "react-native";
import React from "react";
import { useTheme } from "native-base";

type Props = {
  message: string;
};

const SnapSyncTitle = (props: Props) => {
  const { message } = props;

  const colors = useTheme().colors;

  // const countdown = useCountdown({
  //   minutes: snapSync?.timer.minutes || 0,
  //   seconds: snapSync?.timer.seconds || 10,
  //   format: "mm:ss",
  //   autoStart: false,
  //   onCompleted: () => onTimerEnd,
  // });

  return (
    <Text
      style={{
        color: colors.black,
        fontSize: 12,
        fontWeight: "bold",
        letterSpacing: 1,
        fontStyle: "italic",
      }}
    >
      {message}
    </Text>
  );
};

export default SnapSyncTitle;

const styles = StyleSheet.create({});
