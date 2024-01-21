import axios from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  FETCH_MESSAGES_URI,
  FETCH_CHATS_URI,
  SEND_MESSAGE_URI,
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
