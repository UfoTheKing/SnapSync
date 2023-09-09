import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import React from "react";
import { RectTwoStyles, SnapSyncStyles } from "../styles";
import { useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { InvitedUser } from "@/business/redux/features/snapsync/snapSyncSlice";
import { Positions } from "@/utils/positions";

type Props = {
  onPressInvite: () => void;
};

const FullRight = (props: Props) => {
  const { onPressInvite } = props;

  const invitedUsers = useSelector(
    (state: RootState) => state.snapSync.invitedUsers
  );

  const user: InvitedUser | undefined = React.useMemo(() => {
    return invitedUsers.find((user) => user.position === Positions.FullRight);
  }, [invitedUsers]);

  return (
    <View style={RectTwoStyles.right}>
      {user ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={SnapSyncStyles.avatar}
            source={{
              uri: user.profilePictureUrl,
            }}
          />
          <Text style={SnapSyncStyles.username}>{user.username}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={onPressInvite}>
          <Text style={SnapSyncStyles.inviteText}>Invite</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FullRight;

const styles = StyleSheet.create({});
