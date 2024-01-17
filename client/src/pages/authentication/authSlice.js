import { createSlice } from "@reduxjs/toolkit";
import { signin, logout } from "../../api";

const initialState = {
  loading: false,
  error: {},
  user: {},
  isAuth: false,
  response: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
      })
      .addCase(signin.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          user: action.payload,
          response: "fulfilled",
          isAuth: true,
        };
      })
      .addCase(signin.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "rejected",
          user: {},
        };
      })
      .addCase(logout.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      .addCase(logout.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "user logged out rejected.",
        };
      });
  },
});

export default authSlice.reducer;
