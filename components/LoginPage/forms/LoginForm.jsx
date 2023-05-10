import React, { useState } from "react";
import styles from "@/styles/Login.module.css";

const LoginForm = () => {
  const [signinDetails, setSigninDetails] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form>
      <div className={styles.input_container}>
        <label>Email:</label>
        <input
          name="email"
          type="email"
          placeholder="Enter your email address here"
          required
          value={signinDetails.email}
          onChange={handleChange}
        />
      </div>
      <div className={styles.input_container}>
        <label>Password:</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password here"
          required
          value={signinDetails.password}
          onChange={handleChange}
        />
      </div>
      <button
        type={"submit"}
        className={styles.form_button}
        onClick={handleSubmit}
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
