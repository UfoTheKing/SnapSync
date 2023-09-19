import { LabelColor } from "@/constants/Layout";
import { StyleSheet } from "react-native";

export const EditProfileStyles = StyleSheet.create({
  label: {
    color: LabelColor,
    fontSize: 12,
    lineHeight: 18,
  },
  input: {
    height: 55,
    borderRadius: 50,
    fontSize: 18,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 14,
    color: "#999999",
  },
});
