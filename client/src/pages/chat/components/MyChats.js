import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { fetchChats, accessChat } from "../../../api";
import avatar from "../../../data/avatar.png";

const MyChats = () => {
  const { user } = useSelector((state) => state.auth);
  const { chats, chat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const startMessage = (id) => {
    dispatch(accessChat({ axiosPrivate, id }));
  };

  useEffect(() => {
    dispatch(fetchChats(axiosPrivate));
  }, []);

  return (
    <div className="flex flex-col gap-2 bg-white sm:h-[262px] h-[46vh] rounded-md border-2 border-green-200">
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
            .map((chatItem) => (
              <div
                key={chatItem._id}
                onClick={() => {
                  startMessage(chatItem._id);
                }}
                className={`flex flex-row gap-2 p-2 rounded-md cursor-pointer ${
                  chat?.users
                    .map((user) => {
                      return user.fullname;
                    })
                    .find((name) => name !== user.fullname) ===
                  chatItem?.users
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
                    alt={chatItem?.latestMessage.sender?.fullname}
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <div>
                  <p>
                    <b>
                      {chatItem?.users
                        .map((user) => {
                          return user.fullname;
                        })
                        .find((name) => name !== user.fullname)}
                    </b>
                  </p>
                  <p>
                    {" "}
                    <b>
                      {chatItem?.latestMessage?.sender?.fullname ===
                        user.fullname && " You: "}
                    </b>
                    {chatItem?.latestMessage.content.length > 12
                      ? chatItem?.latestMessage.content.substring(0, 12) + "..."
                      : chatItem?.latestMessage.content}
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
