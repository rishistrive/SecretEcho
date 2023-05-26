import { Divider, Drawer } from "@mui/material";
import React, { useState } from "react";
import styles from "@/styles/Home.module.css";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentChat, setChats } from "@/redux";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import UserListItem from "./UserListItem";

const SearchDialog = ({ openDialog, handleClose }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const chats = useSelector((state) => state.chats);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const handleSubmit = async () => {
    if (search) {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/user?search=${search}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSearchResult(data);
        setLoading(false);
      } catch (error) {
        alert(error.response.data);
        setLoading(false);
      }
    }
  };
  const accessChat = async (user) => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/chats`,
        {
          userId: user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(setCurrentChat({ currentChat: data }));
      !chats.find((item) => {
        return JSON.stringify(item) === JSON.stringify(data);
      }) && dispatch(setChats({ chats: [data, ...chats] }));
      handleClose();
    } catch (error) {
      alert(error.response.data);
    }
  };
  return (
    <Drawer anchor="left" open={openDialog} onClose={handleClose}>
      <span className={styles.dialog_heading}>Search User</span>
      <Divider />
      <div className={styles.search_input_container}>
        <input
          type={"search"}
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button onClick={handleSubmit}>Go</button>
      </div>
      <div>
        {loading ? (
          <Stack spacing={0} marginLeft={1.5} marginRight={1.5}>
            {Array(6)
              .fill()
              .map((_, index) => (
                <Skeleton
                  key={index}
                  variant="text"
                  sx={{ fontSize: "3rem" }}
                />
              ))}
          </Stack>
        ) : (
          searchResult.map((user, index) => (
            <UserListItem key={index} user={user} handleFunction={accessChat} />
          ))
        )}
      </div>
    </Drawer>
  );
};

export default SearchDialog;
