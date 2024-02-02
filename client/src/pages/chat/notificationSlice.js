import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  logout,
  sendNotifications,
  deleteNotification,
} from "../../api";

const initialState = {
  loading: false,
  error: {},
  notifications: [],
  newNotification: {},
  response: "",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendNotifications.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(sendNotifications.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "send notification fulfilled",
          newNotification: action.payload,
        };
      })
      .addCase(sendNotifications.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "send notification rejected",
          notifications: [],
          newNotification: {},
        };
      })
      .addCase(fetchNotifications.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "fetch notifications fulfilled",
          notifications: action.payload,
        };
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "fetch notifications rejected",
          notifications: [],
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

export default notificationSlice.reducer;
