import { Text, View } from "react-native";
import React from "react";
import {
  TabView,
  SceneRendererProps,
  NavigationState,
  TabBar,
} from "react-native-tab-view";
import { ScreenWidth } from "@/constants/Layout";
import { LightBackground } from "@/utils/theme";
import { useTheme } from "native-base";
import FriendsRoute from "./Friends/FriendsRoute";
import { SmallUser } from "@/models/resources/User";
import PendingRoute from "./Friends/PendingRoute";

const ThirdRoute = () => (
  <View style={{ flex: 1, backgroundColor: "#f5d7e3" }} />
);

// const renderScene = SceneMap({
//   first: FriendsRoute,
//   second: SecondRoute,
//   third: ThirdRoute,
// });

type Props = {
  onPressUsername?: (user: SmallUser) => void;
  onPressOutgoingRequests?: () => void;
};

const FriendsTabView = (props: Props) => {
  const { onPressUsername, onPressOutgoingRequests } = props;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Friends" },
    { key: "second", title: "Pending" },
    { key: "third", title: "For You" },
  ]);

  const renderScene = (
    props: SceneRendererProps & {
      route: {
        key: string;
        title: string;
      };
    }
  ) => {
    switch (props.route.key) {
      case "first":
        return <FriendsRoute onPressUsername={onPressUsername} />;
      case "second":
        return (
          <PendingRoute
            onPressUsername={onPressUsername}
            onPressOutgoingRequests={onPressOutgoingRequests}
          />
        );
      case "third":
        return <ThirdRoute />;
    }
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: ScreenWidth }}
      renderTabBar={(props) => <CustomTabBar {...props} />}
    />
  );
};

export default FriendsTabView;

const CustomTabBar = (
  props: SceneRendererProps & {
    navigationState: NavigationState<{
      key: string;
      title: string;
    }>;
  }
) => {
  const colors = useTheme().colors;

  return (
    <TabBar
      {...props}
      style={{ backgroundColor: LightBackground }}
      indicatorStyle={{ backgroundColor: colors.primary[100] }}
      renderLabel={({ route, focused, color }) => (
        <Text
          style={{
            color: focused ? "#000" : "#6c757d",
            fontSize: 12,
            letterSpacing: 0.5,
            textAlign: "center",
            width: ScreenWidth / 3,
            fontWeight: focused ? "bold" : "normal",
          }}
        >
          {route.title}
        </Text>
      )}
    />
  );
};
