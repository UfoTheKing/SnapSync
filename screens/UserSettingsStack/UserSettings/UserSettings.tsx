import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { UserSettingsStackScreenProps } from "@/types";
import GoBackButton from "@/components/GoBackButton";
import Container from "@/components/Container";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Switch, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { FetchSettingsWebInfo, SetIsPrivate } from "@/api/routes/accounts";
import { useMutation, useQuery } from "react-query";
import { useFocusEffect } from "@react-navigation/native";
import * as StoreReview from "expo-store-review";

const UserSettings = ({
  navigation,
}: UserSettingsStackScreenProps<"UserSettings">) => {
  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // HOOKS
  const insets = useSafeAreaInsets();
  const colors = useTheme().colors;

  // MUTATIONS
  const mutation = useMutation(
    (isPrivate: boolean) => SetIsPrivate(isPrivate, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
      },
    }
  );

  // QUERIES
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery(
    ["user", "settings", tokenApi],
    () => FetchSettingsWebInfo(tokenApi),
    {
      enabled: false,
    }
  );

  // STATES
  const [isPrivate, setIsPrivate] = React.useState(false);

  // EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <GoBackButton onPress={() => navigation.goBack()} />,
    });
  }, [navigation]);

  React.useEffect(() => {
    if (data) {
      setIsPrivate(data.webInfo.privateAccount);
    }
  }, [data]);

  useFocusEffect(
    React.useCallback(() => {
      if (isLoggedIn) refetch();
    }, [isLoggedIn])
  );

  // FUNCTIONS
  const handleRateApp = async () => {
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    }
  };

  return (
    <Container safeAreaTop={false}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
        }}
      >
        <View
          style={[
            styles.box,
            {
              width:
                SCREEN_WIDTH - insets.left - insets.right > 317
                  ? 317
                  : SCREEN_WIDTH - insets.left - insets.right,
            },
          ]}
        >
          <View style={styles.boxTitle}>
            <LinearGradient
              // Background Linear Gradient
              colors={[colors.primary[900], colors.primary[100]]}
              style={styles.background}
            >
              <Ionicons
                name="ios-shield-checkmark-sharp"
                size={20}
                color="white"
              />
            </LinearGradient>
            <Text style={styles.title}>Security</Text>
          </View>
          <View
            style={[
              styles.boxOptions,
              {
                width:
                  SCREEN_WIDTH - insets.left - insets.right > 317
                    ? 317
                    : SCREEN_WIDTH - insets.left - insets.right,
              },
            ]}
          >
            <View style={styles.option}>
              <Text style={styles.optionTitle}>Devices Activities</Text>
              <Ionicons
                name={"chevron-forward-outline"}
                size={20}
                color={"black"}
              />
            </View>
          </View>
        </View>
        <View
          style={[
            styles.box,
            {
              width:
                SCREEN_WIDTH - insets.left - insets.right > 317
                  ? 317
                  : SCREEN_WIDTH - insets.left - insets.right,
            },
          ]}
        >
          <View style={styles.boxTitle}>
            <LinearGradient
              // Background Linear Gradient
              colors={[colors.primary[900], colors.primary[100]]}
              style={styles.background}
            >
              <Ionicons name="md-lock-closed" size={20} color="white" />
            </LinearGradient>
            <Text style={styles.title}>Privacy</Text>
          </View>
          <View
            style={[
              styles.boxOptions,
              {
                width:
                  SCREEN_WIDTH - insets.left - insets.right > 317
                    ? 317
                    : SCREEN_WIDTH - insets.left - insets.right,
              },
            ]}
          >
            <View style={styles.option}>
              <Text style={styles.optionTitle}>Private Profile</Text>
              <Switch
                value={isPrivate}
                size="sm"
                disabled={
                  isLoading || isRefetching || isError || mutation.isLoading
                }
                onToggle={(value) => {
                  if (typeof value === "boolean") {
                    setIsPrivate(value);
                    mutation.mutate(value);
                  }
                }}
              />
            </View>
            <TouchableOpacity
              style={styles.option}
              onPress={() => navigation.navigate("UserSettingsBlockedUsers")}
            >
              <Text style={styles.optionTitle}>Blocked Users</Text>
              <Ionicons
                name={"chevron-forward-outline"}
                size={20}
                color={"black"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            styles.box,
            {
              width:
                SCREEN_WIDTH - insets.left - insets.right > 317
                  ? 317
                  : SCREEN_WIDTH - insets.left - insets.right,
            },
          ]}
        >
          <View style={styles.boxTitle}>
            <LinearGradient
              // Background Linear Gradient
              colors={[colors.primary[900], colors.primary[100]]}
              style={styles.background}
            >
              <Ionicons name="ios-help-circle" size={20} color="white" />
            </LinearGradient>
            <Text style={styles.title}>About</Text>
          </View>
          <View
            style={[
              styles.boxOptions,
              {
                width:
                  SCREEN_WIDTH - insets.left - insets.right > 317
                    ? 317
                    : SCREEN_WIDTH - insets.left - insets.right,
              },
            ]}
          >
            <TouchableOpacity style={styles.option} onPress={handleRateApp}>
              <Text style={styles.optionTitle}>Rate SnapSync</Text>
              <Ionicons
                name={"chevron-forward-outline"}
                size={20}
                color={"black"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default UserSettings;

const styles = StyleSheet.create({
  box: {
    marginBottom: 48,
  },
  boxTitle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 25,
    marginLeft: 10,
    letterSpacing: 0.2,
  },
  background: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOptions: {
    borderRadius: 20,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,

    backgroundColor: "#FFFFFF",
    paddingHorizontal: 21,
    paddingVertical: 10.5,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 40,
    marginVertical: 5,
  },
  optionTitle: {
    color: "#908F8F",
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: 0.2,
  },
});
