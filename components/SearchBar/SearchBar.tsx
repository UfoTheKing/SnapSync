import React from "react";
import { SEARCH_SHRINK_WIDTH } from "./styles";
import { AntDesign } from "@expo/vector-icons";
import { Icon, Input } from "native-base";
import { PlaceholderColor } from "@/constants/Layout";

type Props = {
  query: string;
  onChangeText: (text: string) => void;

  h?: number;
  w?: number;

  onFocus?: () => void;
  onBlur?: () => void;
};

const SearchBar = (props: Props) => {
  const {
    query,
    onChangeText,

    h = 30,

    onFocus,
    onBlur,
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);

  React.useEffect(() => {
    if (isFocused) {
      onFocus && onFocus();
    } else {
      onBlur && onBlur();
    }
  }, [isFocused]);

  return (
    <Input
      style={{
        height: h,
        width: SEARCH_SHRINK_WIDTH,
      }}
      placeholder="Search..."
      variant="outline"
      rightElement={
        <Icon
          as={<AntDesign name="search1" />}
          size="sm"
          m={2}
          color={PlaceholderColor}
        />
      }
      placeholderTextColor={PlaceholderColor}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onChangeText={onChangeText}
      value={query}
      rounded="full"
    />
  );
};

export default SearchBar;
