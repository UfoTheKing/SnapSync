import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SnapSyncStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { Image } from "expo-image";
import useCountdown from "@bradgarropy/use-countdown";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "native-base";
import SnapSyncTitle from "@/components/SnapSync/SnapSyncTitle/SnapSyncTitle";
import { LightBackground } from "@/utils/theme";

const PublishSnap = ({
  navigation,
  route,
}: SnapSyncStackScreenProps<"PublishSnap">) => {
  const { key, image, shape } = route.params;

  // REDUX
  const createdByMe = useSelector(
    (state: RootState) => state.snapSync.createdByMe
  );

  // HOOKS
  const countdown = useCountdown({
    minutes: 0,
    seconds: 20,
    format: "mm:ss",
    autoStart: true,
    onCompleted: () => publishSnap(),
  });
  const insets = useSafeAreaInsets();
  const colors = useTheme().colors;

  // MUTATIONS

  // STATES
  const [layout, setLayout] = React.useState({ h: 0, w: 0 });

  // EFFECTS
  React.useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {});
  }, []);

  // FUNCTIONS
  const publishSnap = () => {
    console.log("publishSnap");
  };

  return (
    <Container>
      <View
        style={[
          styles.grid,
          {
            // maxHeight: ScreenHeight,
            alignItems: "center",
            justifyContent: "center",
            marginTop: insets.top + (StatusBar.currentHeight || 0),
            maxHeight: shape.height,
            maxWidth: shape.width,
          },
        ]}
        onLayout={(e) => {
          setLayout({
            h: e.nativeEvent.layout.height,
            w: e.nativeEvent.layout.width - 20,
          });
        }}
      >
        <Image
          source={{ uri: image }}
          style={{
            width: layout.w,
            height: Math.floor(layout.w / (shape.width / shape.height)),
            borderRadius: 20,
          }}
        />

        <View
          style={{
            height: 50 + insets.bottom,
            width: layout.w,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SnapSyncTitle
            message={`Your snap will be published in ${countdown.seconds} seconds`}
          />
          <TouchableOpacity
          // onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                color: colors.red[500],
                fontSize: 16,
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default PublishSnap;

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    backgroundColor: LightBackground,
  },
  header: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
