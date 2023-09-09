import { StyleSheet, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HomeStackParamList,
  HomeStackScreenProps,
  RootStackScreenProps,
} from "@/types";
import HomeScreen from "@/screens/Tabs/Home/HomeScreen";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useMutation } from "react-query";
import { SendExpoPushToken } from "@/api/routes/notifications";
import { useNavigation } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type Props = {};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const TabHomeStack = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);

  const navigation = useNavigation();

  const saveExpoPushTokenMutation = useMutation(
    (token: Notifications.ExpoPushToken) => SendExpoPushToken(token, tokenApi)
  );

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        let data = notification.request.content.data;

        // console.log(notification.request.content.data);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let data = response.notification.request.content.data;
        if (data && data.key && data.type === "JOIN_SNAP") {
          navigation.navigate("SnapSyncStack", {
            screen: "SnapSync",
            params: {
              mode: "join",
              key: data.key,
            },
          });
        }
        //console.log(response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (expoPushToken) {
      saveExpoPushTokenMutation.mutate(expoPushToken);
    }
  }, [expoPushToken]);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({
          navigation,
        }: {
          navigation: HomeStackScreenProps<"Home">["navigation"];
        }) => ({
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
};

export default TabHomeStack;

const styles = StyleSheet.create({});
