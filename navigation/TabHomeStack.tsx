import { StyleSheet, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList, HomeStackScreenProps } from "@/types";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useMutation } from "react-query";
import { SendExpoPushToken } from "@/api/routes/notifications";
import { useNavigation } from "@react-navigation/native";
import Home from "@/screens/TabHomeStack/Home/Home";
import {
  AsyncStorageGetExpoPushToken,
  AsyncStorageStoreExpoPushToken,
} from "@/business/async-storage/ExpoPushToken";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

        console.log(notification.request.content.data);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // TODO: Se l'utente è già nella schermata di TakeSnap, non navigare
        let data = response.notification.request.content.data;
        if (data && data.key && data.type === "JOIN_SNAP") {
          navigation.navigate("SnapSyncStack", {
            screen: "TakeSnap",
            params: {
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
      saveExpoPushToken(expoPushToken);
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
        // alert("Failed to get push token for push notification!");
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      // console.log(token);
    } else {
      // alert("Must use physical device for Push Notifications");
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

  const saveExpoPushToken = async (token: Notifications.ExpoPushToken) => {
    // Controllo se il token è già stato salvato nel AsyncStorage

    try {
      const t = await AsyncStorageGetExpoPushToken();
      if (t) {
      } else {
        // Salvo il token nel AsyncStorage
        await AsyncStorageStoreExpoPushToken(token.data);
        // Salvo il token nel DB
        saveExpoPushTokenMutation.mutate(token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
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
