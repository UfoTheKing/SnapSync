import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useCountdown from "@bradgarropy/use-countdown";
import { SnapSyncTimer } from "@/models/wss/SnapSync";

type Props = {
  timer: SnapSyncTimer;

  onCompleted: () => void;
};

const Timer = (props: Props) => {
  const { timer, onCompleted } = props;

  const countdown = useCountdown({
    minutes: timer.minutes,
    seconds: timer.seconds,
    format: "mm:ss",
    autoStart: false,
    onCompleted: () => onCompleted(),
  });

  React.useEffect(() => {
    if (timer.start) countdown.start();
  }, [timer.start]);

  return (
    <View>
      <Text>{countdown.formatted}</Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
