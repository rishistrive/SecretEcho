import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import styles from "../../../styles/Home.module.css";

const UpdateGroupChatModal = ({ open, handleClose }) => {
  const selectedChat = useSelector((state) => state.currentChat);
  const loggedUser = useSelector((state) => state.user);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <span className={styles.updateGroup_heading}>
          {selectedChat.chatName}
        </span>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={0}>
          {selectedChat.users.map((selectedUser, index) => {
            return (
              <Grid key={index} item xs={3}>
                <div className={styles.selectedUser_badge}>
                  <span>{selectedUser.name.split(" ")[0]}</span>
                  <IconButton
                    sx={{ height: "1px", width: "1px", color: "white" }}
                    onClick={() => {}}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Grid>
            );
          })}
        </Grid>
        <div className={styles.groupchat_form_row}>
          <input
            type="text"
            placeholder="Enter chat name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <Button variant={"contained"} sx={{ backgroundColor: "#309798" }}>
            Update
          </Button>
        </div>
        <div className={styles.groupchat_form_row}>
          <input
            type="text"
            placeholder="Add user to group"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" color={"error"}>
          Leave Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
