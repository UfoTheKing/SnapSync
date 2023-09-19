import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
  ws: WebSocket | null;
  isLogged: boolean;
}

const initialState: SocketState = {
  ws: null,
  isLogged: false,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initWs: (state, action: PayloadAction<WebSocket>) => {
      state.ws = action.payload;
    },
    loginWs: (state) => {
      state.isLogged = true;
    },
    logoutWs: (state) => {
      state.isLogged = false;
    },

    resetWs: (state) => {
      state.ws = null;
    },
  },
});

export const { initWs, loginWs, logoutWs, resetWs } = socketSlice.actions;

export default socketSlice.reducer;
