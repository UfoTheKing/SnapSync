import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Shape } from "@/models/project/Shape";
import { Image } from "expo-image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/business/redux/app/store";
import { LightBackground } from "@/utils/theme";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Camera } from "expo-camera";
import {
  setCameraIsReady,
  setUri,
} from "@/business/redux/features/snapsync/snapSyncSlice";

type Props = {
  cWidth: number;
  cHeight: number;
  shape: Shape;
  rowColunm: number;

  position: string;

  rIndex: number;
  cIndex: number;

  handlePress?: () => void;
};

const SnapSyncGridCell = (props: Props) => {
  const {
    shape,
    cHeight,
    cWidth,
    rowColunm,
    position,
    rIndex,
    cIndex,
    handlePress,
  } = props;
  const { grid } = shape;

  const user = useSelector((state: RootState) => state.user.user);
  const users = useSelector((state: RootState) => state.snapSync.users);
  const snapSync = useSelector((state: RootState) => state.snapSync.snapSync);
  const snap = useSelector((state: RootState) => state.snapSync.snap);

  const dispatch = useDispatch();

  const ref = React.useRef<Camera>(null);

  React.useEffect(() => {
    if (snap.timerCompleted) {
      takeSnap();
    }
  }, [snap.timerCompleted]);

  const p = React.useMemo(() => {
    return shape.positions.find(
      (p) => p.name.toUpperCase() === position.toUpperCase()
    );
  }, [position, shape.positions]);

  const u = React.useMemo(() => {
    return users.find(
      (u) => u.position.toUpperCase() === position.toUpperCase()
    );
  }, [position, users]);

  const isMyCell = React.useMemo(() => {
    if (user && u) {
      if (u.id === user.id) {
        return true;
      }
    }

    return false;
  }, [user, u]);

  const borderTopLeftRadius = React.useMemo(() => {
    if (snapSync && snapSync.timer.start) return 0;
    return rIndex === 0 && cIndex === 0 ? 20 : 0;
  }, [rIndex, cIndex, snapSync]);

  const borderTopRightRadius = React.useMemo(() => {
    if (snapSync && snapSync.timer.start) return 0;
    return rIndex === 0 && cIndex === rowColunm - 1 ? 20 : 0;
  }, [rIndex, cIndex, rowColunm, snapSync]);

  const borderBottomLeftRadius = React.useMemo(() => {
    if (snapSync && snapSync.timer.start) return 0;
    return rIndex === grid.length - 1 && cIndex === 0 ? 20 : 0;
  }, [rIndex, cIndex, grid.length, snapSync]);

  const borderBottomRightRadius = React.useMemo(() => {
    if (snapSync && snapSync.timer.start) return 0;
    return rIndex === grid.length - 1 && cIndex === rowColunm - 1 ? 20 : 0;
  }, [rIndex, cIndex, grid.length, rowColunm, snapSync]);

  const takeSnap = async () => {
    if (ref.current) {
      const photo = await ref.current.takePictureAsync({
        quality: 1,
        base64: true,
      });

      // console.log(photo);

      dispatch(setUri(photo.uri));
    }
  };

  return (
    <Animated.View
      style={[
        styles.cell,
        {
          width: cWidth / rowColunm,
          height: cHeight / grid.length,
          borderTopLeftRadius: borderTopLeftRadius,
          borderTopRightRadius: borderTopRightRadius,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
        },
      ]}
    >
      {u ? (
        snapSync && snapSync.timer.start && isMyCell ? (
          <Camera
            ref={ref}
            flashMode={snap.flashMode}
            type={snap.cameraType}
            onCameraReady={() => {
              dispatch(setCameraIsReady(true));
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <>
            <Image
              source={{ uri: u?.profilePictureUrl }}
              style={{
                ...StyleSheet.absoluteFillObject,
                flexWrap: "wrap",
                borderTopLeftRadius: borderTopLeftRadius,
                borderTopRightRadius: borderTopRightRadius,
                borderBottomLeftRadius: borderBottomLeftRadius,
                borderBottomRightRadius: borderBottomRightRadius,
              }}
              blurRadius={10}
            />
            <View
              style={{
                position: "relative",
                width: "100%",
                height: 100,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.username}>{u.username}</Text>
            </View>
          </>
        )
      ) : p ? (
        <TouchableOpacity onPress={handlePress}>
          <AntDesign name="adduser" size={24} color="black" />
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
};

export default SnapSyncGridCell;

const styles = StyleSheet.create({
  cell: {
    borderWidth: 1,
    borderColor: "#c2c2c2",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: LightBackground,
  },
  username: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
