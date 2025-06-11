import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChats, setCurrentChat } from "@/redux";
import styles from "@/styles/Home.module.css";
import AddIcon from "@mui/icons-material/Add";
import GroupChatDialog from "./GroupChatDialog";
import CircularProgress from "@mui/material/CircularProgress";
import Toast from "@/components/common/Toast";
import socket from "@/socket";

const MyChats = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const currentChat = useSelector((state) => state.currentChat);
  const chats = useSelector((state) => state.chats);
  const [loggedUser, setLoggedUser] = useState(user);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackbarProps, setSnackBarProps] = useState({ color: "success", message: "Snackbar message" });
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: data }));
    } catch (error) {
      setSnackBarProps({ color: "error", message: error?.response?.data || "Failed to fetch chats" });
      setSnackOpen(true);
    }
  };

  useEffect(() => {
    fetchChats();
    if (loggedUser && loggedUser._id) {
      socket.emit("setup", loggedUser);
      socket.on("connected", () => {
        console.log(" Socket connected from MyChats");
      });
      return () => {
        socket.off("connected");
      };
    }
  }, [loggedUser]);

  return (
    <div className={`${styles.mychats_container} ${currentChat && styles.hidden_container}`}> 
      <div className={styles.mychats_heading}>
        My Chats
        <button onClick={handleClickOpen}><span>New Group Chat</span> <AddIcon /></button>
      </div>
      <GroupChatDialog open={open} handleClose={handleClose} />
      {chats ? (
        <div className={styles.mychats_body}>
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`${styles.mychats_chat} ${currentChat == chat ? styles.mychats_selectedChat : ""}`}
              onClick={() => dispatch(setCurrentChat({ currentChat: chat }))}
            >
              {!chat.isGroupChat ? (
                <span>{chat.users.filter((user) => user._id !== loggedUser._id)[0]?.name}</span>
              ) : (
                <span>{chat.chatName}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <CircularProgress sx={{ marginTop: "6rem" }} size={"4rem"} />
      )}
      <Toast color={snackbarProps.color} message={snackbarProps.message} snackOpen={snackOpen} handleSnackClose={handleSnackClose} />
    </div>
  );
};

export default MyChats;