import { Shape } from "@/models/project/Shape";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SnapSyncUser {
  id: number;
  position: string;
  profilePictureUrl: string;

  joined: boolean;
}

export interface SnapSyncState {
  shape: Shape | null;
  users: Array<SnapSyncUser>;

  key: string | null;
}

const initialState: SnapSyncState = {
  shape: null,
  users: [],

  key: null,
};

export const snapSyncSlice = createSlice({
  name: "snapsync",
  initialState,
  reducers: {
    initShape: (state, action: PayloadAction<Shape>) => {
      state.shape = action.payload;
    },
    changeShape: (state, action: PayloadAction<Shape>) => {
      state.users = [];
      state.shape = action.payload;
    },
    addUser: (state, action: PayloadAction<SnapSyncUser>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<{ id: number }>) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    },
    resetUsers: (state) => {
      state.users = [];
    },
    joinUser: (state, action: PayloadAction<{ id: number }>) => {
      state.users = state.users.map((user) => {
        if (user.id === action.payload.id) {
          return {
            ...user,
            joined: true,
          };
        }
        return user;
      });
    },

    initSnapInstanceKey: (state, action: PayloadAction<string>) => {
      state.key = action.payload;
    },

    reset: () => initialState,
  },
});

export const {
  initShape,
  addUser,
  removeUser,
  reset,
  resetUsers,
  joinUser,
  initSnapInstanceKey,
  changeShape,
} = snapSyncSlice.actions;

export default snapSyncSlice.reducer;
