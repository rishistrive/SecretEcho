import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  currentChat: null,
  chats: [], 
  notifications: [],
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
      state.chats = [];
      state.notifications = [];
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload.currentChat;
    },
    setChats: (state, action) => {
      state.chats = action.payload.chats;
    },
    addChat: (state, action) => {
      const newChat = action.payload.chat;
      const exists = state.chats.find((c) => c._id === newChat._id);
      if (!exists) {
        state.chats.unshift(newChat); // add new chat to the top
      }
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload.notifications;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload); // latest notification first
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setUser,
  setToken,
  setLogout,
  setCurrentChat,
  setChats,
  addChat,
  setNotifications,
  addNotification,
  clearNotifications,
} = authSlice.actions;

export default authSlice.reducer;
