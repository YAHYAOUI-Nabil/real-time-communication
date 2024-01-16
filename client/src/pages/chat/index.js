import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

const Index = () => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <div className="flex flex-row gap-2 h-screen p-2">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Index;
