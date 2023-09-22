import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import React from "react";
import { SmallUser } from "@/models/resources/User";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SearchByQuery } from "@/api/routes/searches";
import Container from "@/components/Container";
import { Spinner } from "native-base";
import ErrorHandler from "@/components/Error/ErrorHandler/ErrorHandler";
import Inline from "@/components/User/Inline/Inline";
import InlineSkeleton from "@/components/User/InlineSkeleton/InlineSkeleton";
import AcceptButton from "@/components/User/Buttons/AcceptButton/AcceptButton";
import AddButton from "@/components/User/Buttons/AddButton/AddButton";
import UnfriendButton from "@/components/User/Buttons/UnfriendButton/UnfriendButton";
import {
  AcceptFriendship,
  CreateFriendship,
  DeleteFriendship,
} from "@/api/routes/friendship";

type Props = {
  query: string;
  onPress: (user: SmallUser) => void;
};

const SearchResults = (props: Props) => {
  const { query, onPress } = props;

  // REDUX
  const tokenApi = useSelector((state: RootState) => state.user.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // HOOKS
  const queryClient = useQueryClient();

  // MUTATIONS
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
    }
  );

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
    }
  );

  // QUERIES
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery(
    ["search", query, tokenApi],
    () => SearchByQuery(query, tokenApi),
    {
      enabled: false,
    }
  );

  // EFFECTS
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length < 3) return;

      refetch();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  React.useEffect(() => {
    return () => {
      queryClient.invalidateQueries(["search"], { exact: false });
      queryClient.removeQueries(["search"], { exact: false });
    };
  }, []);

  // FUNCTIONS
  const handleConfirmUnfriend = (username: string, userId: number) => {
    Alert.alert(
      `Unfriend ${username}?`,
      "If you unfriend someone, we will not notify them. ",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Unfriend",
          style: "destructive",
          onPress: () => unfriendMutation.mutate(userId),
        },
      ]
    );
  };

  //   if (isLoading) {
  //     return (
  //       <Container textCenter>
  //         <Spinner size="sm" />
  //       </Container>
  //     );
  //   }

  if (isError) {
    return (
      <Container textCenter>
        <ErrorHandler error={error} />
      </Container>
    );
  }

  return (
    <Container safeAreaTop={false}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        scrollEnabled={!isLoading && !isRefetching}
      >
        {isLoading || isRefetching
          ? new Array(10).fill(0).map((_, index) => {
              return (
                <InlineSkeleton
                  key={index}
                  containerStyle={{
                    paddingHorizontal: 15,
                    paddingBottom: 10,
                  }}
                />
              );
            })
          : data &&
            Object.keys(data).map((key) => {
              let item = data[key];

              return (
                <View key={key} style={styles.result}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {item.users.map((user, index) => {
                    return (
                      <Inline
                        user={user}
                        key={index}
                        onPress={() => onPress(user)}
                        containerStyle={{
                          marginTop: 10,
                        }}
                        disabled={isRefetching}
                        rightComponent={
                          <View
                            style={{
                              flex: 1,
                              alignItems: "flex-end",
                              justifyContent: "center",
                            }}
                          >
                            {item.showAcceptButton ? (
                              <AcceptButton
                                onPress={() => {
                                  acceptFriendRequestMutation.mutate(user.id);
                                }}
                                isLoading={
                                  acceptFriendRequestMutation.isLoading &&
                                  acceptFriendRequestMutation.variables ===
                                    user.id
                                }
                              />
                            ) : item.showAddButton ? (
                              <AddButton
                                onPress={() => {
                                  addFriendMutation.mutate(user.id);
                                }}
                                isLoading={
                                  addFriendMutation.isLoading &&
                                  addFriendMutation.variables === user.id
                                }
                              />
                            ) : item.showRemoveButton ? (
                              <UnfriendButton
                                onPress={() => {
                                  handleConfirmUnfriend(user.username, user.id);
                                }}
                                isLoading={
                                  unfriendMutation.isLoading &&
                                  unfriendMutation.variables === user.id
                                }
                              />
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
    </Container>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  result: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#c2c2c2",
    letterSpacing: 1,
    lineHeight: 20,
  },
});
