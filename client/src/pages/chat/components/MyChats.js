import React, { useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, fetchMessages } from "../../../api";
import avatar from "../../../data/avatar.png";

const MyChats = () => {
  const { user } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const fetchMsg = (id) => {
    dispatch(fetchMessages({ axiosPrivate, id }));
  };

  useEffect(() => {
    dispatch(fetchChats(axiosPrivate));
  }, []);

  return (
    <div className="flex flex-col gap-2 bg-white h-[50%] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My chats</p>
        <button className="p-2 text-sm font-medium border-2 border-green-200 rounded-md">
          New Group Chat
        </button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {chats?.length > 0 ? (
          chats?.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                fetchMsg(chat._id);
              }}
              className="flex flex-row gap-2 p-2 bg-gray-200 rounded-md cursor-pointer"
            >
              <div>
                <img
                  src={avatar}
                  alt={chat?.latestMessage.sender?.fullname}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <div>
                <p>
                  <b>
                    {chat?.users
                      .map((user) => {
                        return user.fullname;
                      })
                      .find((name) => name !== user.fullname)}
                  </b>
                </p>
                <p>
                  {" "}
                  <b>
                    {chat?.latestMessage.sender.fullname === user.fullname &&
                      " You: "}
                  </b>
                  {chat.latestMessage.content.length > 35
                    ? chat.latestMessage.content.substring(0, 35) + "..."
                    : chat.latestMessage.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>no chats to show</p>
        )}
      </div>
    </div>
  );
};

export default MyChats;
