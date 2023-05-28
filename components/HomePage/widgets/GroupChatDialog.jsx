import React, { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setChats, setCurrentChat } from "@/redux";
import UserListItem from "./UserListItem";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const GroupChatDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const chats = useSelector((state) => state.chats);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setGroupChatName("");
    setSearch("");
    setSelectedUsers([]);
    setSearchResult([]);
    handleClose();
  };

  const fetchUsers = async (query) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/user?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      alert(error.response.data);
    }
  };

  const handleSearchChange = async (e) => {
    setSearch(e.target.value);
    if (e.target.value.length <= 0) {
      setSearchResult([]);
    } else {
      fetchUsers(e.target.value);
    }
  };

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group`,
        { name: groupChatName, users: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setCurrentChat({ currentChat: data }));
      !chats.find((item) => {
        return JSON.stringify(item) === JSON.stringify(data);
      }) && dispatch(setChats({ chats: [data, ...chats] }));
      closeModal();
    } catch (error) {
      alert(error.response.data);
    }
  };

  return (
    <Dialog open={open} onClose={closeModal}>
      <DialogTitle
        fontSize={"25px"}
        fontFamily={"Work Sans"}
        display={"flex"}
        justifyContent={"center"}
      >
        <div className={styles.groupchat_title}>
          <span>Create Group Chat</span>
          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className={styles.groupchat_form}>
          <input
            type="text"
            placeholder="Enter chat name"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type names of users e.g: John, Jane"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <Grid container spacing={0}>
          {selectedUsers.map((selectedUser, index) => {
            return (
              <Grid key={index} item xs={3}>
                <div className={styles.selectedUser_badge}>
                  <span>{selectedUser.name.split(" ")[0]}</span>
                  <IconButton
                    sx={{ height: "1px", width: "1px", color: "white" }}
                    onClick={() => {
                      setSelectedUsers((prevValue) => {
                        return prevValue.filter((item) => {
                          return item._id !== selectedUser._id;
                        });
                      });
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </div>
              </Grid>
            );
          })}
        </Grid>
        {!loading ? (
          searchResult.slice(0, 4).map((user, index) => (
            <UserListItem
              key={index}
              user={user}
              handleFunction={(userObject) => {
                !selectedUsers.find((item) => {
                  return JSON.stringify(item) === JSON.stringify(userObject);
                }) &&
                  setSelectedUsers((prevValue) => {
                    return [...prevValue, userObject];
                  });
              }}
            />
          ))
        ) : (
          <Stack spacing={0} marginLeft={1.5} marginRight={1.5}>
            {Array(2)
              .fill()
              .map((_, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  sx={{ fontSize: "3rem" }}
                />
              ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          Create chat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupChatDialog;
