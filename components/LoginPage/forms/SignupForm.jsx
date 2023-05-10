import React, { useState } from "react";
import styles from "@/styles/Login.module.css";

const SignupForm = () => {
  const [signinDetails, setSigninDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pic, setPic] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const postDetails = (pics) => {};

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form>
      <div className={styles.input_container}>
        <label>Name:</label>
        <input
          name="name"
          type="text"
          placeholder="Enter your full names here"
          required
          value={signinDetails.name}
          onChange={handleChange}
        />
      </div>
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
      <div className={styles.input_container}>
        <label>Confirm password:</label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          value={signinDetails.confirmPassword}
          onChange={handleChange}
        />
      </div>
      <div className={styles.input_container}>
        <label>Upload your profile picture:</label>
        <input
          type={"file"}
          accept={"image/*"}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </div>
      <button
        type={"submit"}
        className={styles.form_button}
        onClick={handleSubmit}
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupForm;
