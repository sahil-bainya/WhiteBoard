import { createSlice } from "@reduxjs/toolkit";
// for storing that current user is logged in or not.
const initialState = {
  status: false,
  user: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.status = true;
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.status = false;
      state.user = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions; // these are actions , not reducers.
export default authSlice.reducer;
