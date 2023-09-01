import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "@/components/Container";
import { ScreenWidth } from "@/constants/Layout";
import SearchBar from "@/components/SearchBar";
import FriendsTabView from "@/components/Search/FriendsTabView";
import { SearchStackScreenProps } from "@/types";
import Search from "@/components/Search/Search";

const SearchScreen = ({ navigation }: SearchStackScreenProps<"Search">) => {
  const [query, setQuery] = React.useState("");

  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <Container>
      <View
        style={{
          width: ScreenWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={styles.containerSearchBar}>
          <SearchBar
            query={query}
            onChangeText={(text) => setQuery(text)}
            h={40}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setQuery("");
            }}
          />
        </View>
      </View>
      {isFocused ? (
        <Search
          query={query}
          onPress={(user) => {
            navigation.navigate("UserProfileStack", {
              screen: "UserProfile",
              params: {
                fromHome: false,
                userId: user.id,
                username: user.username,
              },
            });
          }}
        />
      ) : (
        <FriendsTabView
          onPressUsername={(user) => {
            navigation.navigate("UserProfileStack", {
              screen: "UserProfile",
              params: {
                fromHome: false,
                userId: user.id,
                username: user.username,
              },
            });
          }}
          onPressOutgoingRequests={() => {
            navigation.navigate("OutgoingRequests");
          }}
        />
      )}
    </Container>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  containerSearchBar: {
    width: ScreenWidth,
  },
});
