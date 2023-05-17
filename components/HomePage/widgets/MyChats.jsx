import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setChats, setCurrentChat } from "@/redux";
import styles from "@/styles/Home.module.css";
import AddIcon from "@mui/icons-material/Add";
import GroupChatDialog from "./GroupChatDialog";

const MyChats = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const currentChat = useSelector((state) => state.currentChat);
  const chats = useSelector((state) => state.chats);
  const [loggedUser, setLoggedUser] = useState(user);

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: data }));
    } catch (error) {
      alert(error.response.data);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.mychats_container}>
      <div className={styles.mychats_heading}>
        My Chats
        <button onClick={handleClickOpen}>
          <span>New Group Chat</span> <AddIcon />
        </button>
      </div>
      <GroupChatDialog open={open} handleClose={handleClose} />
      {chats && (
        <div className={styles.mychats_body}>
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`${styles.mychats_chat} ${
                currentChat == chat ? styles.mychats_selectedChat : ""
              }`}
              onClick={() => dispatch(setCurrentChat({ currentChat: chat }))}
            >
              {!chat.isGroupChat ? (
                <span>
                  {
                    chat.users.filter((user) => user._id !== loggedUser._id)[0]
                      .name
                  }
                </span>
              ) : (
                <span>{chat.chatName}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyChats;
