import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, accessChat } from "../../../api";
import avatar from "../../../data/avatar.png";

const MyChats = () => {
  const { user } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [colorChat, setColorChat] = useState("second");

  const startMessage = (id) => {
    dispatch(accessChat({ axiosPrivate, id }));
  };

  useEffect(() => {
    dispatch(fetchChats(axiosPrivate));
  }, []);

  return (
    <div className="flex flex-col gap-2 bg-white h-[262px] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My chats</p>
        <button className="p-2 text-sm font-medium border-2 border-green-200 rounded-md">
          New Group Chat
        </button>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-auto overflow-x-hidden scrollbar-hide">
        {chats?.length > 0 ? (
          chats
            ?.filter((chat) => chat?.hasOwnProperty("latestMessage"))
            .map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  startMessage(chat._id);
                  setColorChat(
                    chat?.users
                      .map((user) => {
                        return user.fullname;
                      })
                      .find((name) => name !== user.fullname)
                  );
                }}
                className={`flex flex-row gap-2 p-2 rounded-md cursor-pointer ${
                  colorChat ===
                  chat?.users
                    .map((user) => {
                      return user.fullname;
                    })
                    .find((name) => name !== user.fullname)
                    ? "bg-green-400"
                    : "bg-gray-200"
                }`}
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
                      {chat?.latestMessage?.sender?.fullname ===
                        user.fullname && " You: "}
                    </b>
                    {chat?.latestMessage.content.length > 35
                      ? chat?.latestMessage.content.substring(0, 35) + "..."
                      : chat?.latestMessage.content}
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
