import React, { useEffect } from "react";
import styles from "../../../styles/Home.module.css";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import Avatar from "@mui/material/Avatar";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

const isLastMessage = (message, messages, index) => {
  if (index < messages.length - 1) {
    return message.sender._id !== messages[index + 1].sender._id;
  }
  return true;
};

const SingleChatMessages = ({ messages, istyping }) => {
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
          return (
            <span
              className={
                message.sender._id == user._id
                  ? styles.single_chat_message_userContainer
                  : styles.single_chat_message_senderContainer
              }
              key={index}
            >
              {isLastMessage(message, messages, index) &&
                message.sender._id !== user._id && (
                  <Avatar src={message.sender.pic} />
                )}
              <span
                style={{
                  marginLeft: !isLastMessage(message, messages, index)
                    ? "49px"
                    : "0px",
                  marginBottom: isLastMessage(message, messages, index)
                    ? "25px"
                    : "0px",
                }}
                className={
                  message.sender._id == user._id
                    ? styles.single_chat_message_user
                    : styles.single_chat_message_sender
                }
              >
                {message.content}
              </span>
            </span>
          );
        })}
        {istyping && (
          <div>
            <Lottie
              options={defaultOptions}
              width={70}
              style={{ marginBottom: 15, marginLeft: 0 }}
            />
          </div>
        )}
      </ScrollableFeed>
    </div>
  );
};

export default SingleChatMessages;
