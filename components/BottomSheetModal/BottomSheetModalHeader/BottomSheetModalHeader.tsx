import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title?: string;
  subitle?: string;

  showCancel?: boolean;
  showBack?: boolean;
  showBackIcon?: boolean;

  showDivider?: boolean;

  onPressCancel?: () => void;
  onPressBack?: () => void;
};

const HEADER_HEIGHT = 50;

const BottomSheetModalHeader = (props: Props) => {
  const {
    title,
    subitle,

    showCancel = false,

    showBack = false,
    showBackIcon = true,

    showDivider = true,

    onPressCancel,
    onPressBack,
  } = props;

  return (
    <View
      style={{
        ...styles.container,
        ...(showDivider && styles.divider),
      }}
    >
      <View style={styles.backContainer}>
        {showBack && (
          <TouchableOpacity onPress={onPressBack}>
            {showBackIcon ? (
              <Ionicons name="arrow-back" size={24} color="black" />
            ) : (
              <Text style={styles.textBack}>Back</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.titleAndSubtitleContainer}>
        {title && <Text style={styles.textTitle}>{title}</Text>}
        {subitle && <Text style={styles.textSubtitle}>{subitle}</Text>}
      </View>
      <View style={styles.cancelContainer}>
        {showCancel && (
          <TouchableOpacity onPress={onPressCancel}>
            <Text style={styles.textCancel}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BottomSheetModalHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    height: HEADER_HEIGHT,
    paddingHorizontal: 10,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#d3d3d3",
  },

  backContainer: {
    flex: 1,
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  titleAndSubtitleContainer: {
    flex: 6,
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelContainer: {
    flex: 1,
    height: HEADER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  textBack: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },

  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  textSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#d3d3d3",
  },

  textCancel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ff6f61",
  },
});
