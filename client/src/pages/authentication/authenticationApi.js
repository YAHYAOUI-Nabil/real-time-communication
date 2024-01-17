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

// export const signup = createAsyncThunk("auth/signup", async (formData) => {
//   const response = await axios.post(signupUrl, formData);
//   return response.data;
// });

export const logout = createAsyncThunk("auth/logout", async () => {
  const response = await axios.post(LOGOUT_URI);
  return response.data;
});

// export const editInfos = createAsyncThunk(
//   "auth/editInfos",
//   async (formData) => {
//     const response = await axios.put(editInfosUrl, formData);
//     return response.data;
//   }
// );

// export const validateUser = createAsyncThunk(
//   "auth/validateUser",
//   async (formData) => {
//     const response = await axios.put(validateUserUrl, formData);
//     localStorage.setItem("accessToken", response.data.token);
//     return response.data;
//   }
// );

// export const deleteAccount = createAsyncThunk(
//   "auth/deleteAccount",
//   async () => {
//     const response = await axios.delete(deleteAccountUrl);
//     localStorage.removeItem("accessToken");
//     return response.data;
//   }
// );
