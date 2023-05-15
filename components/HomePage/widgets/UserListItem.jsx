import { Avatar } from "@mui/material";
import React from "react";
import styles from "@/styles/Home.module.css";

const UserListItem = ({ user, accessChat }) => {
  return (
    <div
      className={styles.userList_item_container}
      onClick={() => accessChat(user._id)}
    >
      <Avatar src={user.pic} sx={{ width: 55, height: 55 }} />
      <div className={styles.userList_item_details}>
        <span>{user.name}</span>
        <span>
          <b>Email: </b>
          {user.email}
        </span>
      </div>
    </div>
  );
};

export default UserListItem;
