import { StyleSheet, Text, View } from "react-native";
import React from "react";
import useCountdown from "@bradgarropy/use-countdown";

type Props = {
  minutes: number;
  seconds: number;

  start: boolean;

  onCompleted: () => void;
};

const Timer = (props: Props) => {
  const { minutes, seconds, start, onCompleted } = props;

  const countdown = useCountdown({
    minutes: minutes,
    seconds: seconds,
    format: "mm:ss",
    autoStart: false,
    onCompleted: () => onCompleted(),
  });

  React.useEffect(() => {
    if (start) countdown.start();
  }, [start]);

  return (
    <View>
      <Text>{countdown.formatted}</Text>
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({});
