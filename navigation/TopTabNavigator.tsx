import { RootTabParamList } from "@/types";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { View } from "react-native";
import TabHomeStack from "./TabHomeStack";

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

type Props = {};

const TopTabNavigator = (props: Props) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 0,
        },
      }}
      initialRouteName="TabHomeStack"
    >
      <Tab.Screen
        name="TabFriendsStack"
        component={TabFriendsStack}
        options={{
          tabBarLabel: "Friends",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
      />

      <Tab.Screen
        name="TabHomeStack"
        component={TabHomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
      />

      <Tab.Screen
        name="TabUserProfileStack"
        component={TabUserProfileStack}
        options={{
          tabBarLabel: "Profile",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TopTabNavigator;

function TabUserProfileStack() {
  return <View style={{ flex: 1, backgroundColor: "red" }}></View>;
}

function TabFriendsStack() {
  return <View style={{ flex: 1, backgroundColor: "blue" }}></View>;
}
