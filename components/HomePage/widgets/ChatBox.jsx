import React from "react";
import styles from "@/styles/Home.module.css";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  return (
    <div className={styles.chatbox_container}>
      <SingleChat />
    </div>
  );
};

export default ChatBox;
