import { StyleSheet, Image, View, TouchableOpacity } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList, HomeStackScreenProps } from "@/types";
import HomeScreen from "@/screens/Tabs/Home/HomeScreen";
import { VStack } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";

type Props = {};

const Stack = createNativeStackNavigator<HomeStackParamList>();

const TabHomeStack = (props: Props) => {
  const user = useSelector((state: RootState) => state.user.user);

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
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <Image
                      source={{
                        uri: "https://1000marche.net/wp-content/uploads/2020/03/Instagram-Logo-2010-2013.png",
                      }}
                      style={{
                        width: 100,
                        height: 30,
                        resizeMode: "contain",
                      }}
                    /> */}
            </View>
          ),
          headerRight: () => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Root", { screen: "TabUserProfileStack" })
                }
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: 10,
                    borderRadius: 15,
                    backgroundColor: "#f7f7f7",
                  }}
                >
                  {user && user.profilePictureUrl ? (
                    <Image
                      source={{
                        uri: user.profilePictureUrl,
                      }}
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        borderRadius: 15,
                      }}
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          },
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 10,
                width: 30,
                height: 30,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() =>
                navigation.navigate("Root", { screen: "TabSearchStack" })
              }
            >
              <VStack
                style={{
                  width: 30,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialIcons name="group" size={24} color="black" />
              </VStack>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default TabHomeStack;

const styles = StyleSheet.create({});
