import { createSlice } from "@reduxjs/toolkit";
import { fetchChats } from "../../api";

const initialState = {
  loading: false,
  error: {},
  chats: [],
  response: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
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
      });
  },
});

export default chatSlice.reducer;
