/* eslint-disable @next/next/no-img-element */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import styles from "../../../styles/Home.module.css";

const ProfileModal = ({ open, handleClose, image, email }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Profile details
      </DialogTitle>
      <DialogContent
        sx={{
          paddingLeft: 10,
          paddingRight: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img className={styles.profile_image} src={image} alt="User image" />
        <DialogContentText sx={{ mt: 3, fontSize: "23px" }}>
          Email: {email}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
