import { createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../../api";

const initialState = {
  loading: false,
  error: {},
  users: [],
  response: "",
};

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          response: "fetch users fulfilled",
          users: action.payload,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.error,
          response: "fetch users rejected",
          users: [],
        };
      });
  },
});

export default userSlice.reducer;
