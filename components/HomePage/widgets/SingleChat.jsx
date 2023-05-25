import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setNotifications } from "@/redux";
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
  const notifications = useSelector((state) => state.notifications);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [chatSender, setChatSender] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnection, setSocketConnection] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loggedUser);
    socket.on("connected", () => setSocketConnection(true));
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notifications.includes(newMessageReceived)) {
          dispatch(setNotifications({ notification: newMessageReceived }));
        }
      } else {
        setMessages((prevValue) => {
          return [...prevValue, newMessageReceived];
        });
      }
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    setNewMessage("");
    socket.emit("stop typing", selectedChat._id);
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
      socket.emit("new message", data);
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
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      alert(error.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    selectedChat && fetchChatMessages();
    setNewMessage("");
    selectedChatCompare = selectedChat;
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

  const handleType = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnection) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className={styles.chatbox_container}>
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
                <SingleChatMessages messages={messages} istyping={istyping} />
              )}
            </div>
            <div className={styles.select_chat_sendMessage}>
              <input
                type="text"
                placeholder="Enter message here"
                value={newMessage}
                onChange={handleType}
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
    </div>
  );
};

export default SingleChat;
