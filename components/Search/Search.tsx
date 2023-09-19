import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Container from "../Container";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { SearchByQuery } from "@/api/routes/searches";
import { Button, Spinner } from "native-base";
import { instanceOfErrorResponseType } from "@/api/client";
import InlineUser from "../InlineUser";
import { SmallUser } from "@/models/resources/User";
import { LightBackground } from "@/utils/theme";
import {
  AcceptFriendship,
  CreateFriendship,
  DeleteFriendship,
} from "@/api/routes/friendship";
import { INLINE_USER_HEIGHT } from "../User/styles";

type Props = {
  query: string;
  onPress?: (user: SmallUser) => void;
};

const Search = (props: Props) => {
  const { query, onPress } = props;

  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const user = useSelector((state: RootState) => state.user.user);

  const queryClient = useQueryClient();

  const acceptFriendRequestMutation = useMutation(
    (userId: number) => AcceptFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
        queryClient.invalidateQueries(["user", "friends", tokenApi]);
        queryClient.removeQueries(["user", "friends", tokenApi], {
          exact: true,
        });

        queryClient.invalidateQueries(["user", "incoming_requests", tokenApi]);
        queryClient.removeQueries(["user", "incoming_requests", tokenApi], {
          exact: true,
        });
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          // console.log(error.message);
        }
      },
    }
  );

  const addFriendMutation = useMutation(
    (userId: number) => CreateFriendship(userId, tokenApi),
    {
      onSuccess: (data) => {
        refetch();
        queryClient.invalidateQueries(["user", "outgoing_requests", tokenApi]);
        queryClient.removeQueries(["user", "outgoing_requests", tokenApi], {
          exact: true,
        });
      },
      onError: (error) => {
        if (error && instanceOfErrorResponseType(error)) {
          // console.log(error.message);
        }
      },
    }
  );

  const unfriendMutation = useMutation(
    (userId: number) => DeleteFriendship(userId, tokenApi),
    {
      onSuccess: () => {
        refetch();
        queryClient.invalidateQueries(["user", "friends", tokenApi]);
        queryClient.removeQueries(["user", "friends", tokenApi], {
          exact: true,
        });
      },
    }
  );

  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery(
    ["search", tokenApi],
    () => SearchByQuery(query, tokenApi),
    {
      enabled: false,
    }
  );

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length < 3) return;

      refetch();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  React.useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["search"]);
    };
  }, []);

  const handleConfirmUnfriend = (username: string, userId: number) => {
    Alert.alert("Unfriend", `Are you sure you want to unfriend ${username}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Unfriend",
        style: "destructive",
        onPress: () => unfriendMutation.mutate(userId),
      },
    ]);
  };

  return (
    <Container>
      {query.length < 3 ? (
        <Text
          style={{
            color: "#000",
            fontSize: 12,
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          Recent searches
        </Text>
      ) : isLoading || isRefetching ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Spinner size="sm" />
        </View>
      ) : isError ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: "#000",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            {error && instanceOfErrorResponseType(error)
              ? error.message
              : "Something went wrong"}
          </Text>
        </View>
      ) : data ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          {Object.keys(data).map((key) => {
            let item = data[key];
            return (
              <View
                key={key}
                style={{
                  width: "100%",
                  paddingHorizontal: 15,
                  paddingBottom: 10,
                }}
              >
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.users.map((user, index) => {
                  return (
                    <InlineUser
                      onPress={() => props.onPress?.(user)}
                      key={user.id}
                      username={user.username}
                      fullName={user.fullName}
                      profilePictureUrl={user.profilePictureUrl}
                      isVerified={user.isVerified}
                      containerStyle={{
                        marginTop: 10,
                      }}
                      rightComponent={
                        <View
                          style={{
                            alignItems: "flex-end",
                            height: INLINE_USER_HEIGHT,
                            // marginRight: 30,
                            justifyContent: "center",
                            flex: 1,
                          }}
                        >
                          {item.showAcceptButton ? (
                            <Button
                              colorScheme="primary"
                              size="sm"
                              rounded="full"
                              isLoading={
                                acceptFriendRequestMutation.isLoading &&
                                acceptFriendRequestMutation.variables ===
                                  user.id
                              }
                              onPress={() => {
                                acceptFriendRequestMutation.mutate(user.id);
                              }}
                              _text={{
                                fontWeight: "bold",
                                letterSpacing: 0.5,
                              }}
                            >
                              Accept
                            </Button>
                          ) : item.showAddButton ? (
                            <Button
                              colorScheme="secondary"
                              size="sm"
                              rounded="full"
                              isLoading={
                                addFriendMutation.isLoading &&
                                addFriendMutation.variables === user.id
                              }
                              onPress={() => {
                                addFriendMutation.mutate(user.id);
                              }}
                              _text={{
                                fontWeight: "bold",
                                letterSpacing: 0.5,
                              }}
                            >
                              Add
                            </Button>
                          ) : item.showRemoveButton ? (
                            <Button
                              colorScheme="error"
                              size="sm"
                              rounded="full"
                              isLoading={
                                unfriendMutation.isLoading &&
                                unfriendMutation.variables === user.id
                              }
                              onPress={() => {
                                handleConfirmUnfriend(user.username, user.id);
                              }}
                              _text={{
                                fontWeight: "bold",
                                letterSpacing: 0.5,
                              }}
                            >
                              Unfriend
                            </Button>
                          ) : null}
                        </View>
                      }
                    />
                  );
                })}
              </View>
            );
          })}
        </ScrollView>
      ) : null}
    </Container>
  );
};

export default Search;

const styles = StyleSheet.create({
  itemTitle: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#c2c2c2",
  },
});
