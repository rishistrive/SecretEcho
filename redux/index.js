import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user =  action.payload.user;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
  },
});

export const { setUser, setToken } = authSlice.actions;
export default authSlice.reducer;
