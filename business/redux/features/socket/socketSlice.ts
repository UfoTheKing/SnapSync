import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SocketState {
  ws: WebSocket | null;
}

const initialState: SocketState = {
  ws: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    initWs: (state, action: PayloadAction<WebSocket>) => {
      state.ws = action.payload;
    },
  },
});

export const { initWs } = socketSlice.actions;

export default socketSlice.reducer;
