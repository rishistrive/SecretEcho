import React, { useState } from "react";
import styles from "@/styles/Login.module.css";
import LoginForm from "./forms/LoginForm";
import SignupForm from "./forms/SignupForm";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className={styles.login_page}>
      <div className={styles.title_container}>
        <span className={styles.title_text}>Chit Chat</span>
      </div>
      <div className={styles.login_container}>
        <div className={styles.choose_tab_container}>
          <span
            className={`${styles.tab_item} ${isLogin && styles.chosen_tab}`}
            onClick={() => {
              setIsLogin(true);
            }}
          >
            Login
          </span>
          <span
            className={`${styles.tab_item} ${!isLogin && styles.chosen_tab}`}
            onClick={() => {
              setIsLogin(false);
            }}
          >
            Signup
          </span>
        </div>
        {isLogin ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
};

export default LoginPage;
