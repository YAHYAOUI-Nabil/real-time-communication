import axios from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  SIGNIN_URI,
  SIGNUP_URI,
  LOGOUT_URI,
  VALIDATE_USER_URI,
  FETCH_USERS_URI,
} from "../../config/apiUri";

export const signin = createAsyncThunk("auth/signin", async (formData) => {
  const response = await axios.post(SIGNIN_URI, formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
});

export const signup = createAsyncThunk("auth/signup", async (formData) => {
  const response = await axios.post(SIGNUP_URI, formData, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return response.data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(LOGOUT_URI);
  return response.data;
});

export const validateUser = createAsyncThunk(
  "auth/validateUser",
  async (formData) => {
    const response = await axios.put(VALIDATE_USER_URI, formData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  }
);

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ axiosPrivate, search }) => {
    const response = await axiosPrivate.get(
      FETCH_USERS_URI + `?search=${search}`
    );
    return response.data;
  }
);

export const addFriend = createAsyncThunk(
  "user/addFriend",
  async ({ axiosPrivate, id }) => {
    const response = await axiosPrivate.put(
      FETCH_USERS_URI + "/add-user/" + id
    );
    return response.data;
  }
);
export const removeFriend = createAsyncThunk(
  "user/addFriend",
  async ({ axiosPrivate, id }) => {
    const response = await axiosPrivate.delete(
      FETCH_USERS_URI + "/remove-friend/" + id
    );
    return response.data;
  }
);
