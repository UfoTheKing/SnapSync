import { View } from "react-native";
import React from "react";
import { SearchStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import SearchBar from "@/components/SearchBar/SearchBar";
import FriendsTabView from "@/components/Search/FriendsTabView/FriendsTabView";
import { Divider } from "native-base";
import SearchResults from "@/components/Search/SearchResults/SearchResults";

const Search = ({ navigation, route }: SearchStackScreenProps<"Search">) => {
  const [query, setQuery] = React.useState<string>("");
  const [isFocused, setIsFocused] = React.useState<boolean>(false);

  return (
    <Container>
      <View
        style={{
          width: SCREEN_WIDTH,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <SearchBar
          query={query}
          onChangeText={(text) => setQuery(text)}
          h={40}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      <Divider mt={2} mb={2} />

      {isFocused || query.length > 0 ? (
        <SearchResults
          query={query}
          onPress={(user) => {
            navigation.navigate("UserProfileStack", {
              screen: "UserProfile",
              params: {
                userId: user.id,
                fromHome: false,
                username: user.username,
                profilePictureUrl: user.profilePictureUrl,
              },
            });
          }}
        />
      ) : (
        <FriendsTabView
          onPressOutgoingRequests={() => {
            navigation.navigate("OutgoingRequests");
          }}
          onPressUsername={(user) => {
            navigation.navigate("UserProfileStack", {
              screen: "UserProfile",
              params: {
                userId: user.id,
                fromHome: false,
                username: user.username,
                profilePictureUrl: user.profilePictureUrl,
              },
            });
          }}
        />
      )}
    </Container>
  );
};

export default Search;
