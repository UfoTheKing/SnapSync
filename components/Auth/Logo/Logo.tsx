import { StyleSheet, Text, View } from "react-native";
import React from "react";

type Props = {
  title: string;
};

const Logo = (props: Props) => {
  const { title } = props;
  return (
    <>
      <View style={styles.logo}>{/* <Text>{userData.sessionId}</Text> */}</View>
      <Text style={styles.title}>{title}</Text>
    </>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginTop: 20,
  },
});
