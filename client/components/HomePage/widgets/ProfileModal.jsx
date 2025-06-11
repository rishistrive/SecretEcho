
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import styles from "../../../styles/Home.module.css";
import Image from "next/image";

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
        <div className={styles.profile_image}>
          <Image
            src={image}
            alt="User image"
            width={120}
            height={120}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
        </div>
        <DialogContentText sx={{ mt: 3, fontSize: "23px" }}>
          Email: {email}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          style={{ backgroundColor: "#25d366" }}
          variant="contained"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileModal;
