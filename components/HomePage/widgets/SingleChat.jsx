import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat } from "@/redux";
import styles from "@/styles/Home.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfileModal from "./ProfileModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.currentChat);
  const loggedUser = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [chatSender, setChatSender] = useState(null);
  useEffect(() => {
    if (selectedChat) {
      setChatSender(
        !selectedChat.isGroupChat
          ? selectedChat.users.filter((user) => user._id !== loggedUser._id)[0]
          : null
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <div className={styles.select_chat_heading}>
            <IconButton
              onClick={() => dispatch(setCurrentChat({ currentChat: null }))}
            >
              <ArrowBackIcon />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <span>{chatSender && chatSender.name}</span>
            ) : (
              <span>{selectedChat.chatName}</span>
            )}
            {!selectedChat.isGroupChat ? (
              <IconButton onClick={() => setOpenModal(true)}>
                <VisibilityIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => setOpenModal2(true)}>
                <VisibilityIcon />
              </IconButton>
            )}
            {chatSender && (
              <ProfileModal
                open={openModal}
                handleClose={() => setOpenModal(false)}
                image={chatSender.pic}
                email={chatSender.email}
              />
            )}
            <UpdateGroupChatModal
              open={openModal2}
              handleClose={() => setOpenModal2(false)}
            />
          </div>
          <div className={styles.select_chat_messages}></div>
        </>
      ) : (
        <div className={styles.select_chat_message}>
          <span className={styles.select_chat_messageText}>
            Click on a user to start chatting
          </span>
        </div>
      )}
    </>
  );
};

export default SingleChat;
