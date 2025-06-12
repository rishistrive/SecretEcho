import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat } from "@/redux";
import styles from "@/styles/Home.module.css";
import Header from "./widgets/Header";
import MyChats from "./widgets/MyChats";
import SingleChat from "./widgets/SingleChat";
import axios from "axios";

const HomePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const router = useRouter();

  const warmupRequest = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API}/api/warmup`);
  };

  useEffect(() => {
    if (!user || !token) {
      router.replace("/login");
    }
   
  }, [user]);

  useEffect(() => {
    warmupRequest();
    dispatch(setCurrentChat({ currentChat: null }));
    
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
