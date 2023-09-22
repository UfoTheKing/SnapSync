import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EditProfileState {
  uriProfilePicture: string | null;
}

const initialState: EditProfileState = {
  uriProfilePicture: null,
};

export const editProfileSlice = createSlice({
  name: "editprofile",
  initialState,
  reducers: {
    setUriProfilePicture: (state, action: PayloadAction<string>) => {
      state.uriProfilePicture = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setUriProfilePicture, reset } = editProfileSlice.actions;

export default editProfileSlice.reducer;
