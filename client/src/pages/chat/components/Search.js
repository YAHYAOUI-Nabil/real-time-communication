import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
const USERS_URL = "/chat";

const Search = () => {
  const [chatsList, setChatsList] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axiosPrivate.get(USERS_URL);
        setChatsList(response.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    fetchNote();
  }, []);
  return (
    <div className="flex flex-col gap-2 bg-white h-[50%] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">Search Result</p>
        <button className="p-2 text-sm font-medium border-2 border-green-200 rounded-md">
          New Group Chat
        </button>
      </div>
      <div className="p-2">
        {chatsList?.length > 0 ? (
          chatsList?.map((chat) => (
            <div key={chat._id} className="p-2 bg-gray-200 rounded-md">
              <p>{chat.chatName}</p>
              <p>
                <b>{chat?.latestMessage.sender?.fullname} :</b>
                {chat.latestMessage.content.substring(0, 51) + "..."}
              </p>
            </div>
          ))
        ) : (
          <p>no chats to show</p>
        )}
      </div>
    </div>
  );
};

export default Search;
