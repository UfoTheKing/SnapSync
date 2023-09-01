import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  BiographyEntity,
  Biography as IBiography,
} from "@/models/project/UserProfile";
import { useTheme } from "native-base";

type Props = {
  bio: IBiography | null;
  onPressEntity?: (entity: BiographyEntity) => void;
};

const Biography = (props: Props) => {
  const { bio } = props;

  const colors = useTheme().colors;

  if (!bio) return null;
  if (!bio.rawText) return null;

  return (
    <Text style={styles.textBio}>
      {bio.rawText.split(" ").map((v, i) => {
        if (v.startsWith("@")) {
          let valueWithoutAt = v.substring(1);
          // Controllo se nella bio.entities c'è un elemento con user === valueWithoutAt
          // Se c'è, allora ritorno un Text con il nome dell'utente
          // Altrimenti ritorno un Text con il valore di v

          let entity = bio.entities?.find((e) => e.text === valueWithoutAt);

          if (entity) {
            return (
              <Text
                key={i}
                style={{
                  color: "#0000EE",
                }}
                onPress={() => {
                  if (entity) props.onPressEntity?.(entity);
                }}
              >
                @{entity.text}{" "}
              </Text>
            );
          }
        }

        return <Text key={i}>{v} </Text>;
      })}
    </Text>
  );
};

export default Biography;

const styles = StyleSheet.create({
  textBio: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: "#808997",
  },
});
