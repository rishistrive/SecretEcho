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
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload.currentChat;
    },
    setChats: (state, action) => {
      state.chats = action.payload.chats;
    },
  },
});

export const { setUser, setToken, setCurrentChat } = authSlice.actions;
export default authSlice.reducer;
