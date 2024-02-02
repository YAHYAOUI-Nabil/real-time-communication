import axios from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FETCH_MESSAGES_URI,
  FETCH_CHATS_URI,
  SEND_MESSAGE_URI,
  ACCESS_CHAT_URI,
  NOTIFICATION_URI,
} from "../../config/apiUri";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async ({ axiosPrivate, id }) => {
    const response = await axiosPrivate.get(FETCH_MESSAGES_URI + "/" + id);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ axiosPrivate, formData }) => {
    const response = await axiosPrivate.post(SEND_MESSAGE_URI, formData);
    return response.data;
  }
);

export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (axiosPrivate) => {
    const response = await axiosPrivate.get(FETCH_CHATS_URI);
    return response.data;
  }
);

export const startChat = createAsyncThunk(
  "chat/startChat",
  async ({ axiosPrivate, data }) => {
    const response = await axiosPrivate.post(ACCESS_CHAT_URI, data);
    return response.data;
  }
);

export const accessChat = createAsyncThunk(
  "chat/accessChat",
  async ({ axiosPrivate, id }) => {
    const response = await axiosPrivate.get(ACCESS_CHAT_URI + "/" + id);
    return response.data;
  }
);

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (axiosPrivate) => {
    const response = await axiosPrivate.get(NOTIFICATION_URI);
    return response.data;
  }
);

export const sendNotifications = createAsyncThunk(
  "notifications/sendNotifications",
  async ({ axiosPrivate, formData }) => {
    const response = await axiosPrivate.post(NOTIFICATION_URI, formData);
    return response.data;
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotifications",
  async ({ axiosPrivate, id }) => {
    const response = await axiosPrivate.delete(NOTIFICATION_URI + "/" + id);
    return response.data;
  }
);
