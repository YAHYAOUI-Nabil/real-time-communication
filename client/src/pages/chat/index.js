import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
import { useSelector } from "react-redux";
import io from "socket.io-client";
var socket;

const Index = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL);
    socket.emit("setup", user);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <div className="flex flex-row gap-2 p-2 grow">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
};

export default Index;
