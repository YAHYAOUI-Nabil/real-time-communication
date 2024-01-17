import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
const USERS_URL = "/user";

const Sidebar = () => {
  const [friendsList, setFriendsList] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axiosPrivate.get(USERS_URL);
        setFriendsList(response.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    fetchNote();
  }, []);
  return (
    <div className="flex flex-col gap-2 w-1/4 bg-white h-[100%] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My chats</p>
        <button className="p-2 text-sm font-medium border-2 border-green-200 rounded-md">
          New Group Chat
        </button>
      </div>
      <div>
        {friendsList ? (
          friendsList?.map((friend) => (
            <div key={friend._id}>{friend.fullname}</div>
          ))
        ) : (
          <p>no friend to show</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
