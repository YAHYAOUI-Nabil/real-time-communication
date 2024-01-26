import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { useSelector } from "react-redux";

const Index = () => {
  const { chat } = useSelector((state) => state.chat);

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <div className="flex flex-row gap-2 p-2 h-max">
        <Sidebar />
        {chat && <Chat />}
      </div>
    </div>
  );
};

export default Index;
