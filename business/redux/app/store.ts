import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import socketReducer from "../features/socket/socketSlice";
import snapSyncReducer from "../features/snapsync/snapSyncSlice";
import editProfileReducer from "../features/editprofile/editProfileSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
    snapSync: snapSyncReducer,
    editProfile: editProfileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
