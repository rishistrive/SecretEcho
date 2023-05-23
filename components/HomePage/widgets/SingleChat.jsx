import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat } from "@/redux";
import styles from "@/styles/Home.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProfileModal from "./ProfileModal";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SingleChatMessages from "./SingleChatMessages";
import { io } from "socket.io-client";

const ENDPOINT = `http://localhost:3000`;
var socket, selectedChatCompare;

const SingleChat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.currentChat);
  const loggedUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [chatSender, setChatSender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);

  const handleSubmit = async () => {
    setNewMessage("");
    if (!newMessage) return;
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/messages`,
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prevValue) => {
        return [...prevValue, data];
      });
    } catch (error) {
      alert(error.response.data);
    }
  };

  const fetchChatMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/messages/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert(error.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    selectedChat && fetchChatMessages();
    setNewMessage("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loggedUser);
    socket.on("connection", () => setSocketConnection(true));
  }, [loggedUser]);

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
          <div className={styles.select_chat_messagesBody}>
            <div className={styles.select_chat_messages}>
              {loading ? (
                <CircularProgress color={"inherit"} />
              ) : (
                <SingleChatMessages messages={messages} />
              )}
            </div>
            <div className={styles.select_chat_sendMessage}>
              <input
                type="text"
                placeholder="Enter message here"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSubmit}>
                <SendIcon />
              </button>
            </div>
          </div>
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
