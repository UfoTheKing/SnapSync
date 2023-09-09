import { SnapSyncData } from "@/models/wss/SnapSync";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InvitedUser {
  id: number;
  position: string;
  profilePictureUrl: string;
  username: string;
}

export interface SnapSyncState {
  snapSync: SnapSyncData | null;
  createdByMe: boolean;
  invitedUsers: InvitedUser[];
}

const initialState: SnapSyncState = {
  snapSync: null,
  createdByMe: false,
  invitedUsers: [],
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
      state.createdByMe = action.payload.createdByMe;
    },
    updateSnapSyncData: (state, action: PayloadAction<SnapSyncData>) => {
      state.snapSync = action.payload;
    },
    addUser: (state, action: PayloadAction<InvitedUser>) => {
      // Verifico se esiste già un utente con lo stesso id
      const user = state.invitedUsers.find(
        (user) => user.id === action.payload.id
      );

      if (!user) {
        // Verifico se esiste un utente nella stessa posizione
        const userInSamePosition = state.invitedUsers.find(
          (user) => user.position === action.payload.position
        );

        if (userInSamePosition) {
          // Se esiste, lo rimuovo
          state.invitedUsers = state.invitedUsers.filter(
            (user) => user.position !== action.payload.position
          );
        }

        // Aggiungo l'utente
        state.invitedUsers.push(action.payload);
      }
    },

    reset: () => initialState,
  },
});

export const { initSnapSyncData, updateSnapSyncData, addUser, reset } =
  snapSyncSlice.actions;

export default snapSyncSlice.reducer;
