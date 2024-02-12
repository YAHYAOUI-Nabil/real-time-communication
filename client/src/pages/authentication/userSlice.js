import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers, logout, addFriend, removeFriend } from "../../api";

const initialState = {
  loading: false,
  error: {},
  users: [],
  friends: [],
  response: "",
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "fetch users fulfilled",
          users: action.payload,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "fetch users rejected",
          users: [],
        };
      })
      .addCase(addFriend.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "add friend fulfilled",
          friends: action.payload,
        };
      })
      .addCase(addFriend.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "add friend rejected",
          friends: [],
        };
      })
      .addCase(removeFriend.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "remove friend fulfilled",
          friends: action.payload,
        };
      })
      .addCase(removeFriend.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "remove friend rejected",
          friends: [],
        };
      })
      .addCase(logout.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(logout.fulfilled, (state, action) => {
        return {
          initialState,
        };
      })
      .addCase(logout.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "logout rejected",
        };
      });
  },
});

export default userSlice.reducer;
