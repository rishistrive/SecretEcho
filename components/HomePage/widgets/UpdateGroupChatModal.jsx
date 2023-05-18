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
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setChats } from "@/redux";
import styles from "../../../styles/Home.module.css";
import axios from "axios";

const UpdateGroupChatModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.currentChat);
  const loggedUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      const { data } = await axios.put(
        `http://localhost:3000/api/chats/group/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setCurrentChat({ currentChat: data }));
      const response = await axios.get(`http://localhost:3000/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
      setGroupChatName("");
    } catch (error) {
      console.log(error);
      alert(error.response.data);
    }
  };

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
          <Button
            variant={"contained"}
            sx={{ backgroundColor: "#309798" }}
            onClick={handleRename}
          >
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
