import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setNotifications } from "@/redux";
import styles from "@/styles/Home.module.css";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import axios from "axios";
import dynamic from "next/dynamic";

import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import Toast from "@/components/common/Toast";

// ✅ Dynamically import SingleChatMessages with SSR disabled
const SingleChatMessages = dynamic(() => import("./SingleChatMessages"), {
  ssr: false,
});

const ENDPOINT = process.env.NEXT_PUBLIC_API;

const SingleChat = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.currentChat);
  const loggedUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const notifications = useSelector((state) => state.notifications);

  const socket = useRef(null);
  const selectedChatCompare = useRef(null);
  const typingTimeoutRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatSender, setChatSender] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackbarProps, setSnackbarProps] = useState({ color: "success", message: "" });

  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", loggedUser);
    socket.current.on("connected", () => {});

    socket.current.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare.current || selectedChatCompare.current._id !== newMessageReceived.chat._id) {
        if (!notifications?.some((n) => n._id === newMessageReceived._id)) {
          dispatch(setNotifications({ notifications: [newMessageReceived, ...notifications] }));
        }
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    socket.current.on("typing", () => setIsTyping(true));
    socket.current.on("stop typing", () => setIsTyping(false));

    return () => {
      socket.current.disconnect();
    };
  }, [dispatch, loggedUser, notifications]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      selectedChatCompare.current = selectedChat;

      if (!selectedChat.isGroupChat) {
        const sender = selectedChat.users.find((u) => u._id !== loggedUser._id);
        setChatSender(sender);
      }
    }
    setNewMessage("");
  }, [selectedChat, loggedUser]);

  const fetchMessages = async () => {
    if (!selectedChat) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${ENDPOINT}/api/messages/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data);
      socket.current.emit("join chat", selectedChat._id);
    } catch (error) {
      setSnackbarProps({ color: "error", message: error.response?.data || "Error loading messages" });
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newMessage.trim() || !socket.current) return;
    socket.current.emit("stop typing", selectedChat._id);
    try {
      const { data } = await axios.post(`${ENDPOINT}/api/messages`, {
        content: newMessage,
        chatId: selectedChat._id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages([...messages, data]);
      socket.current.emit("new message", data);
      setNewMessage("");
    } catch (error) {
      setSnackbarProps({ color: "error", message: error.response?.data || "Failed to send message" });
      setSnackOpen(true);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!socket.current || !selectedChat) return;

    if (!typing) {
      setTyping(true);
      socket.current.emit("typing", selectedChat._id);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit("stop typing", selectedChat._id);
      setTyping(false);
    }, 3000);
  };

  return (
    <div className={`${styles.chatbox_container} ${!selectedChat && styles.hidden_container}`}>
      {selectedChat ? (
        <>
          <div className={styles.select_chat_heading}>
            <IconButton onClick={() => dispatch(setCurrentChat({ currentChat: null }))}>
              <ArrowBackIcon />
            </IconButton>
            <span>{selectedChat.isGroupChat ? selectedChat.chatName : chatSender?.name}</span>
            <IconButton onClick={() => selectedChat.isGroupChat ? setOpenModal2(true) : setOpenModal(true)}>
              <VisibilityIcon />
            </IconButton>
          </div>

          <div className={styles.select_chat_messagesBody}>
            {loading ? (
              <CircularProgress sx={{ marginTop: "10rem" }} size={"4rem"} />
            ) : (
              <SingleChatMessages messages={messages} istyping={isTyping} />
            )}
            <div className={styles.select_chat_sendMessage}>
              <input
                type="text"
                placeholder="Enter message here"
                value={newMessage}
                onChange={handleTyping}
              />
              <button onClick={handleSubmit}><SendIcon /></button>
            </div>
          </div>

          {chatSender && (
            <ProfileModal
              open={openModal}
              handleClose={() => setOpenModal(false)}
              image={chatSender.pic}
              email={chatSender.email}
            />
          )}
          <UpdateGroupChatModal open={openModal2} handleClose={() => setOpenModal2(false)} />
        </>
      ) : (
        <div className={styles.select_chat_message}>
          <span className={styles.select_chat_messageText}>
            Click on a user to start chatting
          </span>
        </div>
      )}
      <Toast
        color={snackbarProps.color}
        message={snackbarProps.message}
        snackOpen={snackOpen}
        handleSnackClose={() => setSnackOpen(false)}
      />
    </div>
  );
};

export default SingleChat;
