import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "@/styles/Home.module.css";
import SideDrawer from "./widgets/SideDrawer";
import MyChats from "./widgets/MyChats";
import ChatBox from "./widgets/ChatBox";

const HomePage = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    user && (
      <div className={styles.home_page}>
        <SideDrawer />
        <div className={styles.chats_chatbox_container}>
          <MyChats />
          <ChatBox />
        </div>
      </div>
    )
  );
};

export default HomePage;
