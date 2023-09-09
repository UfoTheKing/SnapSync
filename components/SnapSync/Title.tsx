import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SnapSyncTimer } from "@/models/wss/SnapSync";
import useCountdown from "@bradgarropy/use-countdown";

type Props = {
  title: string;
  timer: SnapSyncTimer;
  onCompleted: () => void;
};

const Title = (props: Props) => {
  const countdown = useCountdown({
    minutes: props.timer.minutes,
    seconds: props.timer.seconds,
    format: "mm:ss",
    autoStart: false,
    onCompleted: () => props.onCompleted(),
  });

  React.useEffect(() => {
    if (props.timer.start) countdown.start();
  }, [props.timer]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {props.timer.start
          ? props.title.replace("{{timer}}", countdown.formatted)
          : props.title}
      </Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50, // TODO: change to dynamic
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
    fontStyle: "italic",
  },
});
