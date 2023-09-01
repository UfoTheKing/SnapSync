import {
  Keyboard,
  View,
  Animated,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import { ScreenWidth } from "@/constants/Layout";
import { LightBackground } from "@/utils/theme";
import { AntDesign } from "@expo/vector-icons";

type Props = {
  query: string;
  onChangeText: (text: string) => void;

  h?: number;

  onFocus?: () => void;
  onBlur?: () => void;
};

const PADDING = 16;
const SEARCH_FULL_WIDTH = ScreenWidth - PADDING * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = ScreenWidth - PADDING - 90; //search_width when focused

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const SearchBar = (props: Props) => {
  const {
    query,
    onChangeText,

    h = 30,

    onFocus,
    onBlur,
  } = props;

  const [inputLength] = React.useState(new Animated.Value(SEARCH_FULL_WIDTH));
  const [cancelPosition] = React.useState(new Animated.Value(0));
  const [opacity] = React.useState(new Animated.Value(0));
  const [searchBarFocused, setSearchBarFocused] = React.useState(false);

  const handleFocus = () => {
    setSearchBarFocused(true);
    onFocus && onFocus();

    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_SHRINK_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 16,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleBlur = (cancel: boolean = false) => {
    if (query.length > 0 && !cancel) {
      Keyboard.dismiss();
      return;
    }
    setSearchBarFocused(false);
    onBlur && onBlur();

    Animated.parallel([
      Animated.timing(inputLength, {
        toValue: SEARCH_FULL_WIDTH,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <View
      style={[
        styles.searchContainer,
        {
          height: h,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.search,
          {
            width: inputLength,
            position: "absolute",
            left: 16,
            alignSelf: "center",
            height: h,
          },
          searchBarFocused === true ? undefined : { justifyContent: "center" },
        ]}
      >
        <AntDesign name="search1" size={12} color={"#c2c2c2"} />
        <TextInput
          style={styles.searchInput}
          onBlur={() => handleBlur(false)}
          onFocus={handleFocus}
          placeholder="Search..."
          placeholderTextColor="#c2c2c2"
          onChangeText={onChangeText}
          value={query}
        />
      </Animated.View>

      <AnimatedTouchable
        style={[styles.cancelSearch, { right: cancelPosition }]}
        onPress={() => {
          handleBlur(true);
          Keyboard.dismiss();
        }}
      >
        <Animated.Text style={[styles.cancelSearchText, { opacity: opacity }]}>
          Cancel
        </Animated.Text>
      </AnimatedTouchable>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    borderBottomColor: "#00000033",
  },
  search: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 6,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  cancelSearch: {
    position: "absolute",
    marginHorizontal: 16,
    textAlign: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  cancelSearchText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00000033",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    paddingHorizontal: 16,
  },
});
