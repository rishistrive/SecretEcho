import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Badge from "@mui/material/Badge";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setCurrentChat, setNotifications } from "@/redux";
import ProfileModal from "./ProfileModal";
import SearchDialog from "./SearchDialog";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  const [loadingChat, setLoadingChat] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const [openModal, setOpenModal] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNotificationClose = (notification) => {
    dispatch(setCurrentChat({ currentChat: notification.chat }));
    dispatch(
      setNotifications({
        notifications: notifications.filter((item) => {
          return item._id !== notification._id;
        }),
      })
    );
    handleClose2();
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = () => {
    dispatch(setLogout());
  };
  
  return (
    <div className={styles.header}>
      <button
        className={styles.search_button}
        onClick={() => setOpenDialog(true)}
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <span className={styles.search_text}>Search User</span>
      </button>
      <SearchDialog
        openDialog={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
      <span className={styles.app_title}>Chit Chat</span>
      <div className={styles.menu_buttons_container}>
        <IconButton
          color="primary"
          size="small"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant="contained"
          onClick={handleClick2}
        >
          {notifications.length > 0 ? (
            <Badge badgeContent={notifications.length} color={"error"}>
              <NotificationsIcon fontSize="medium" sx={{ color: "black" }} />
            </Badge>
          ) : (
            <NotificationsIcon fontSize="medium" sx={{ color: "black" }} />
          )}
        </IconButton>
        <Button
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Avatar src={user.pic} sx={{ width: 35, height: 35 }} />
          <ExpandMoreIcon sx={{ color: "black" }} />
        </Button>
      </div>
      <Menu anchorEl={anchorEl2} open={open2} onClose={handleClose2}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            return (
              <MenuItem
                key={index}
                onClick={() => handleNotificationClose(notification)}
              >
                <span>New message from {notification.sender.name}</span>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem onClick={handleClose2}>No new notifications</MenuItem>
        )}
      </Menu>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setOpenModal(true);
            setAnchorEl(null);
          }}
        >
          My Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      <ProfileModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        image={user.pic}
        email={user.email}
      />
    </div>
  );
};

export default Header;
