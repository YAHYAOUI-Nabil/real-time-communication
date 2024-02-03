import { createSlice } from "@reduxjs/toolkit";
import { signin, signup, logout, validateUser } from "../../api";

const initialState = {
  loading: false,
  error: {},
  user: {},
  isAuth: false,
  isRegistered: false,
  response: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.user = action.payload;
    },
  },
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
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "registered",
          isRegistered: true,
        };
      })
      .addCase(signup.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "rejected",
        };
      })
      .addCase(validateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(validateUser.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          user: action.payload,
          response: "validation fulfilled",
          isAuth: true,
          isRegistered: false,
        };
      })
      .addCase(validateUser.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "validation rejected",
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

export const { updateToken } = authSlice.actions;
export default authSlice.reducer;
