import React from "react";
import styles from "../../../styles/Home.module.css";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import Avatar from "@mui/material/Avatar";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

// Helper to check if it's the last message from a sender
const isLastMessage = (messages, message, index) => {
  return (
    index < messages.length - 1 &&
    messages[index + 1].sender._id !== message.sender._id
  );
};

const SingleChatMessages = ({ messages = [], istyping = false }) => {
  const user = useSelector((state) => state.user);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={styles.single_chat_messages}>
      <ScrollableFeed>
        {messages.map((message, index) => {
          const isUser = message.sender._id === user._id;
          const showAvatar =
            !isUser && isLastMessage(messages, message, index);

          return (
            <div
              key={index}
              className={
                isUser
                  ? styles.single_chat_message_userContainer
                  : styles.single_chat_message_senderContainer
              }
            >
              {showAvatar && <Avatar src={message.sender.pic} />}
              <span
                style={{
                  marginLeft: !showAvatar ? "49px" : "0px",
                  marginBottom: showAvatar ? "25px" : "4px",
                }}
                className={
                  isUser
                    ? styles.single_chat_message_user
                    : styles.single_chat_message_sender
                }
              >
                {message.content}
              </span>
            </div>
          );
        })}
        {istyping && (
          <div style={{ marginLeft: 10 }}>
            <Lottie options={defaultOptions} width={70} />
          </div>
        )}
      </ScrollableFeed>
    </div>
  );
};

export default SingleChatMessages;
