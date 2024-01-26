import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, logout } from "../../api";

const initialState = {
  loading: false,
  error: {},
  messages: [],
  response: "",
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "fetch messages fulfilled",
          messages: action.payload,
        };
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "fetch messages rejected",
          messages: [],
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

export default messageSlice.reducer;
