import { SnapSyncData, SnapSyncUser } from "@/models/wss/SnapSync";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CameraType, FlashMode } from "expo-camera";

export interface SnapSyncState {
  snapSync: SnapSyncData | null;
  createdByMe: boolean;
  users: SnapSyncUser[];

  snap: {
    cameraIsReady: boolean;
    cameraType: CameraType;
    flashMode: FlashMode;
    timerCompleted: boolean;

    uri: string | null;
  };
}

const initialState: SnapSyncState = {
  snapSync: null,
  createdByMe: false,
  users: [],

  snap: {
    cameraIsReady: false,
    cameraType: CameraType.front,
    flashMode: FlashMode.off,
    timerCompleted: false,

    uri: null,
  },
};

export const snapSyncSlice = createSlice({
  name: "snapsync",
  initialState,
  reducers: {
    initSnapSyncData: (
      state,
      action: PayloadAction<{
        snapSync: SnapSyncData;
        createdByMe: boolean;
      }>
    ) => {
      state.snapSync = action.payload.snapSync;
      state.users = action.payload.snapSync.users;
      state.createdByMe = action.payload.createdByMe;
    },
    updateSnapSyncData: (state, action: PayloadAction<SnapSyncData>) => {
      state.snapSync = action.payload;
      state.users = action.payload.users;
    },
    addUser: (state, action: PayloadAction<SnapSyncUser>) => {
      // Verifico se esiste già un utente con lo stesso id
      const user = state.users.find((user) => user.id === action.payload.id);

      if (!user) {
        // Verifico se esiste un utente nella stessa posizione
        const userInSamePosition = state.users.find(
          (user) => user.position === action.payload.position
        );

        if (userInSamePosition) {
          // Se esiste, lo rimuovo
          state.users = state.users.filter(
            (user) => user.position !== action.payload.position
          );
        }

        // Aggiungo l'utente
        state.users.push(action.payload);
      }
    },

    changeShape: (state, action: PayloadAction<SnapSyncUser>) => {
      state.users = []; // Rimuovo tutti gli utenti
      state.users.push(action.payload); // Aggiungo l'utente
    },

    setCameraIsReady: (state, action: PayloadAction<boolean>) => {
      state.snap.cameraIsReady = action.payload;
    },
    setTimerCompleted: (state, action: PayloadAction<boolean>) => {
      state.snap.timerCompleted = action.payload;
    },
    setUri: (state, action: PayloadAction<string | null>) => {
      state.snap.uri = action.payload;
    },

    reset: () => initialState,
  },
});

export const {
  initSnapSyncData,
  updateSnapSyncData,
  addUser,
  changeShape,
  setCameraIsReady,
  setTimerCompleted,
  setUri,
  reset,
} = snapSyncSlice.actions;

export default snapSyncSlice.reducer;
