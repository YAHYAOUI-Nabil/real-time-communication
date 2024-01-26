import React from "react";
import MyChats from "./MyChats";
import FriendsList from "./FriendsList";

const Sidebar = () => {
  return (
    <div className="flex flex-col gap-2 w-1/4 h-full">
      <FriendsList />
      <MyChats />
    </div>
  );
};

export default Sidebar;
