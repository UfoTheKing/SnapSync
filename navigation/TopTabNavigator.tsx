import { RootTabParamList } from "@/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import TabHomeStack from "./TabHomeStack";
import TabSearchStack from "./TabSearchStack";
import UserProfileStack from "./UserProfileStack";
import * as Contacts from "expo-contacts";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { CreateUserContacts } from "@/api/routes/user";
import { getDeviceUuid } from "@/business/secure-store/DeviceUuid";
import { createWssMessage } from "@/utils/utils";
import { WssActions } from "@/utils/wss";
import { loginWs } from "@/business/redux/features/socket/socketSlice";

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

type Props = {};

const TopTabNavigator = (props: Props) => {
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const ws = useSelector((state: RootState) => state.socket.ws);

  const dispatch = useDispatch();

  const createUserContactsMutation = useMutation((phoneNumbers: string[]) =>
    CreateUserContacts(phoneNumbers, tokenApi)
  );

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
          pageOffset: 0,
          pageSize: 50,
        });

        let phoneNumbers: string[] = [];

        data.forEach((contact) => {
          if (
            contact.phoneNumbers &&
            contact.phoneNumbers.length > 0 &&
            contact.phoneNumbers[0].digits
          ) {
            // Prendo il primo numero di telefono
            phoneNumbers.push(contact.phoneNumbers[0].digits);
          }
        });

        if (phoneNumbers.length > 0) {
          createUserContactsMutation.mutate(phoneNumbers);
        }
      }
    })();
  }, []);

  useEffect(() => {
    async function loginWss() {
      const deviceUuid = await getDeviceUuid();
      if (deviceUuid) {
        let message = createWssMessage(WssActions.Login, tokenApi, deviceUuid);
        ws?.send(message);
      }
    }
    if (ws && tokenApi && isLoggedIn) {
      loginWss();
    }
  }, [ws, tokenApi, isLoggedIn]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.action === WssActions.Login && data.success) {
          dispatch(loginWs());
        }
        // Receive a message from the server
        console.log(e);
      };
    }
  }, [ws]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 0,
        },
      }}
      initialRouteName="TabHomeStack"
    >
      <Tab.Screen name="TabSearchStack" component={TabSearchStack} />

      <Tab.Screen name="TabHomeStack" component={TabHomeStack} />

      <Tab.Screen name="TabUserProfileStack" component={UserProfileStack} />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;
