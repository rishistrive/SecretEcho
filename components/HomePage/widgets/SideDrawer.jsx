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
import ListItemIcon from "@mui/material/ListItemIcon";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setToken } from "@/redux";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);
  const [openModal, setOpenModal] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleLogout = () => {
    dispatch(setUser({ user: null }));
    dispatch(setToken({ token: null }));
  };

  return (
    <div className={styles.side_drawer}>
      <button className={styles.search_button}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <span className={styles.search_text}>Search User</span>
      </button>
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
          <NotificationsIcon fontSize="medium" sx={{ color: "black" }} />
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
        <MenuItem onClick={handleClose}>Notifications menu</MenuItem>
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

export default SideDrawer;
