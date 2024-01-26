import { createSlice } from "@reduxjs/toolkit";
import { fetchChats, accessChat, startChat, logout } from "../../api";

const initialState = {
  loading: false,
  error: {},
  chats: [],
  chat: {},
  response: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startChat.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(startChat.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "start chat fulfilled",
          chat: action.payload,
        };
      })
      .addCase(startChat.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "starts chat rejected",
          chat: {},
        };
      })
      .addCase(accessChat.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(accessChat.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "access chat fulfilled",
          chat: action.payload,
        };
      })
      .addCase(accessChat.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "access chat rejected",
          chat: {},
        };
      })
      .addCase(fetchChats.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "fetch chats fulfilled",
          chats: action.payload,
        };
      })
      .addCase(fetchChats.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "fetch chats rejected",
          chats: [],
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

export default chatSlice.reducer;
