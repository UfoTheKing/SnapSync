import { ILoginResponse } from "@/models/auth/Auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  isLoggedIn: boolean;
  tokenApi: string;

  user: {
    id: number;
    username: string;
    profilePictureUrl: string | null;
    biography: string | null;
    isVerified: boolean;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  tokenApi: "",

  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginResponse>) => {
      state.isLoggedIn = true;
      state.tokenApi = action.payload.tokenData.token;

      state.user = action.payload.user;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.tokenApi = "";
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
