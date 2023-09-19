import { View } from "react-native";
import React from "react";
import { SearchStackScreenProps } from "@/types";
import Container from "@/components/Container";
import { SCREEN_WIDTH } from "@gorhom/bottom-sheet";
import SearchBar from "@/components/SearchBar/SearchBar";
import FriendsTabView from "@/components/Search/FriendsTabView/FriendsTabView";
import { Divider } from "native-base";

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

      {isFocused ? null : (
        <FriendsTabView
          onPressOutgoingRequests={() => {
            navigation.navigate("OutgoingRequests");
          }}
        />
      )}
    </Container>
  );
};

export default Search;
