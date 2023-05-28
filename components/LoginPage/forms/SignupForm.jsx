import React, { useState } from "react";
import styles from "@/styles/Login.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/redux";
import CircularProgress from "@mui/material/CircularProgress";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signinDetails, setSigninDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [pic, setPic] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSigninDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    // Prevent default form behaviour
    e.preventDefault();

    // Form Validation
    const errors = {};
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!signinDetails.name) {
      errors.name = "Please add your full names.";
    }
    if (!signinDetails.email) {
      errors.email = "Please add your email.";
    } else if (!regex.test(signinDetails.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!signinDetails.password) {
      errors.password = "Please add your password.";
    }
    if (!signinDetails.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    }
    if (signinDetails.password !== signinDetails.confirmPassword) {
      errors.confirmPassword = "These passwords do not match";
    }
    setFormErrors(errors);

    // Form data creation and submission
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      const formData = new FormData();
      if (pic) {
        formData.append("pic", pic);
      }
      for (const key in signinDetails) {
        formData.append(key, signinDetails[key]);
      }
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/user/register`,
          formData
        );
        alert(response.data.message);
        dispatch(setUser({ user: response.data.user }));
        dispatch(setToken({ token: response.data.token }));
        setLoading(false);
        router.push("/");
      } catch (error) {
        alert(error.response.data);
        setLoading(false);
      }
    }
  };

  return (
    <form>
      <div className={styles.input_container}>
        <label>Name:</label>
        <input
          className={`${formErrors.name && styles.input_error}`}
          name="name"
          type="text"
          placeholder="Enter your full names here"
          required
          value={signinDetails.name}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.name}</span>
      </div>
      <div className={styles.input_container}>
        <label>Email:</label>
        <input
          className={`${formErrors.email && styles.input_error}`}
          name="email"
          type="email"
          placeholder="Enter your email address here"
          required
          value={signinDetails.email}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.email}</span>
      </div>
      <div className={styles.input_container}>
        <label>Password:</label>
        <input
          className={`${formErrors.password && styles.input_error}`}
          name="password"
          type="password"
          placeholder="Enter your password here"
          required
          value={signinDetails.password}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.password}</span>
      </div>
      <div className={styles.input_container}>
        <label>Confirm password:</label>
        <input
          className={`${formErrors.confirmPassword && styles.input_error}`}
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          value={signinDetails.confirmPassword}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.confirmPassword}</span>
      </div>
      <div className={styles.input_container}>
        <label>Upload your profile picture:</label>
        <input
          type={"file"}
          accept={"image/*"}
          onChange={(e) => setPic(e.target.files[0])}
        />
      </div>
      <button
        type={"submit"}
        className={styles.form_button}
        onClick={handleSubmit}
      >
        {loading ? (
          <CircularProgress color={"inherit"} size={"16px"} />
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
