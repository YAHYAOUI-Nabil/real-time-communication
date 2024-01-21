import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import MyChats from "./MyChats";
import Search from "./Search";
import FriendsList from "./FriendsList";
const USERS_URL = "/chat";

const Sidebar = () => {
  const [chatsList, setChatsList] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  // useEffect(() => {
  //   const fetchNote = async () => {
  //     try {
  //       const response = await axiosPrivate.get(USERS_URL);
  //       setChatsList(response.data);
  //     } catch (err) {
  //       console.log(err.response);
  //     }
  //   };
  //   fetchNote();
  // }, []);
  return (
    <div className="flex flex-col gap-2 w-1/4 h-[100%]">
      {/* <FriendsList /> */}
      <MyChats />
    </div>
  );
};

export default Sidebar;
