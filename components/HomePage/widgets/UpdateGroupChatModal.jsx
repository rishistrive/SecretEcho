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
import UserListItem from "./UserListItem";

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
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setCurrentChat({ currentChat: data }));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
      setGroupChatName("");
    } catch (error) {
      console.log(error);
      alert(error.response.data);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResult(data);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  };

  const handleAddUser = async (user) => {
    delete user.password;
    if (
      selectedChat.users.find(
        (item) => JSON.stringify(item) === JSON.stringify(user)
      )
    ) {
      alert("User already exists in the group");
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/add`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setCurrentChat({ currentChat: data }));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
      setSearch("");
      setSearchResult([]);
    } catch (error) {
      alert(error.response.data);
    }
  };

  const removeUser = async (user) => {
    if (loggedUser._id === user._id) {
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/remove`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setCurrentChat({ currentChat: data }));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
    } catch (error) {
      alert(error.response.data);
    }
  };

  const leaveGroup = async () => {
    if (selectedChat.groupAdmin._id === loggedUser._id) {
      alert("Group admin cannot leave group");
      return;
    }
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/remove`,
        {
          chatId: selectedChat._id,
          userId: loggedUser._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setCurrentChat({ currentChat: null }));
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
      handleClose();
    } catch (error) {
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
                  {selectedChat.isGroupChat &&
                    selectedChat.groupAdmin._id === loggedUser._id && (
                      <IconButton
                        sx={{ height: "1px", width: "1px", color: "white" }}
                        onClick={() => removeUser(selectedUser)}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                </div>
              </Grid>
            );
          })}
        </Grid>
        <div className={styles.groupchat_form_row}>
          <input
            type="text"
            placeholder="Rename group chat"
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
        {selectedChat.isGroupChat &&
          selectedChat.groupAdmin._id === loggedUser._id && (
            <div className={styles.groupchat_form_row}>
              <input
                type="text"
                placeholder="Add user to group"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          )}
        {searchResult.slice(0, 4).map((user, index) => (
          <UserListItem
            key={index}
            user={user}
            handleFunction={handleAddUser}
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={leaveGroup} variant="contained" color={"error"}>
          Leave Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateGroupChatModal;
