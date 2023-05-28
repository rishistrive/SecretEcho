import React, { useState } from "react";
import styles from "@/styles/Login.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setUser, setToken } from "@/redux";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const LoginForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbarProps, setSnackBarProps] = useState({
    color: "success",
    message: "Snackbar message",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form Validation
    const errors = {};
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!loginDetails.email) {
      errors.email = "Please add your email.";
    } else if (!regex.test(loginDetails.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!loginDetails.password) {
      errors.password = "Please add your password.";
    }
    setFormErrors(errors);

    // Form submission
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/api/user/login`,
          loginDetails
        );
        setSnackBarProps({
          color: "success",
          message: response.data.message,
        });
        setOpen(true);
        dispatch(setUser({ user: response.data.user }));
        dispatch(setToken({ token: response.data.token }));
        setLoading(false);
        router.push("/");
      } catch (error) {
        setSnackBarProps({
          color: "error",
          message: error.response.data,
        });
        setOpen(true);
        setLoading(false);
      }
    }
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <form>
      <div className={styles.input_container}>
        <label>Email:</label>
        <input
          className={`${formErrors.email && styles.input_error}`}
          name="email"
          type="email"
          placeholder="Enter your email address here"
          required
          value={loginDetails.email}
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
          value={loginDetails.password}
          onChange={handleChange}
        />
        <span className={styles.form_error}>{formErrors.password}</span>
      </div>
      <button
        type={"submit"}
        className={styles.form_button}
        onClick={handleSubmit}
      >
        {loading ? (
          <CircularProgress color={"inherit"} size={"16px"} />
        ) : (
          "Login"
        )}
      </button>
      <Snackbar
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarProps.color}
          sx={{ width: "100%" }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </form>
  );
};

export default LoginForm;
