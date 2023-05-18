import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  currentChat: null,
  chats: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.currentChat = null;
      state.chats = null;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload.currentChat;
    },
    setChats: (state, action) => {
      state.chats = action.payload.chats;
    },
  },
});

export const { setUser, setToken, setCurrentChat, setChats, setLogout } =
  authSlice.actions;
export default authSlice.reducer;
