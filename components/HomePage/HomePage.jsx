import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat } from "@/redux";
import styles from "@/styles/Home.module.css";
import Header from "./widgets/Header";
import MyChats from "./widgets/MyChats";
import ChatBox from "./widgets/ChatBox";
import SingleChat from "./widgets/SingleChat";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    dispatch(setCurrentChat({ currentChat: null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    user && (
      <div className={styles.home_page}>
        <Header />
        <div className={styles.chats_chatbox_container}>
          <MyChats />
          <SingleChat />
        </div>
      </div>
    )
  );
};

export default HomePage;
