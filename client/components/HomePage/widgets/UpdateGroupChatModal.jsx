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
  Skeleton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setChats } from "@/redux";
import styles from "../../../styles/Home.module.css";
import axios from "axios";
import UserListItem from "./UserListItem";
import Toast from "@/components/common/Toast";

const UpdateGroupChatModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.currentChat);
  const loggedUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackbarProps, setSnackBarProps] = useState({
    color: "success",
    message: "Snackbar message",
  });

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(setCurrentChat({ currentChat: data }));

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(setChats({ chats: response.data }));
      setGroupChatName("");
    } catch (error) {
      setSnackBarProps({
        color: "error",
        message: error?.response?.data || "Rename failed",
      });
      setSnackOpen(true);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/api/user?search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResult(data);
    } catch (error) {
      setSnackBarProps({
        color: "error",
        message: error?.response?.data || "Search failed",
      });
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearch(query);
    handleSearch(query);
  };

  const handleAddUser = async (user) => {
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    const alreadyExists = selectedChat.users.find(
      (u) => u._id === user._id
    );
    if (alreadyExists) {
      setSnackBarProps({
        color: "error",
        message: "User already exists in the group",
      });
      setSnackOpen(true);
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
          headers: { Authorization: `Bearer ${token}` },
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
      setSnackBarProps({
        color: "error",
        message: error?.response?.data || "Failed to add user",
      });
      setSnackOpen(true);
    }
  };

  const removeUser = async (user) => {
    if (loggedUser._id === user._id) return;

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/remove`,
        {
          chatId: selectedChat._id,
          userId: user._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setCurrentChat({ currentChat: data }));

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
    } catch (error) {
      setSnackBarProps({
        color: "error",
        message: error?.response?.data || "Remove failed",
      });
      setSnackOpen(true);
    }
  };

  const leaveGroup = async () => {
    if (selectedChat.groupAdmin._id === loggedUser._id) {
      setSnackBarProps({
        color: "error",
        message: "Group admin cannot leave group",
      });
      setSnackOpen(true);
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/chats/group/remove`,
        {
          chatId: selectedChat._id,
          userId: loggedUser._id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setCurrentChat({ currentChat: null }));

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setChats({ chats: response.data }));
      handleClose();
    } catch (error) {
      setSnackBarProps({
        color: "error",
        message: error?.response?.data || "Leave group failed",
      });
      setSnackOpen(true);
    }
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <span className={styles.updateGroup_heading}>
          {selectedChat?.chatName}
        </span>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={1}>
          {selectedChat?.users.map((selectedUser) => (
            <Grid key={selectedUser._id} item xs={3}>
              <div className={styles.selectedUser_badge}>
                <span>{selectedUser.name.split(" ")[0]}</span>
                {selectedChat.isGroupChat &&
                  selectedChat.groupAdmin?._id === loggedUser._id && (
                    <IconButton
                      sx={{ height: "1px", width: "1px", color: "white" }}
                      onClick={() => removeUser(selectedUser)}
                    >
                      <CloseIcon />
                    </IconButton>
                  )}
              </div>
            </Grid>
          ))}
        </Grid>

        <div className={styles.groupchat_form_row}>
          <input
            type="text"
            placeholder="Rename group chat"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <Button
           style={{backgroundColor:'#25d366'}}
            variant="contained"
            sx={{ backgroundColor: "#309798" }}
            onClick={handleRename}
          >
            Update
          </Button>
        </div>

        {selectedChat.isGroupChat &&
          selectedChat.groupAdmin?._id === loggedUser._id && (
            <div className={styles.groupchat_form_row}>
              <input
                type="text"
                placeholder="Add user to group"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          )}

        {!loading ? (
          searchResult.slice(0, 4).map((user) => (
            <UserListItem
              key={user._id}
              user={user}
              handleFunction={handleAddUser}
            />
          ))
        ) : (
          <Stack spacing={0} marginLeft={1.5} marginRight={1.5}>
            {[...Array(2)].map((_, index) => (
              <Skeleton key={index} variant="text" sx={{ fontSize: "3rem" }} />
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button style={{backgroundColor:'#25d366'}} onClick={leaveGroup} variant="contained" color="error">
          Leave Group
        </Button>
      </DialogActions>

      <Toast
        color={snackbarProps.color}
        message={snackbarProps.message}
        snackOpen={snackOpen}
        handleSnackClose={handleSnackClose}
      />
    </Dialog>
  );
};

export default UpdateGroupChatModal;
