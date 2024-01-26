import React, { useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, startChat, fetchChats } from "../../../api";
import avatar from "../../../data/avatar.png";

const FriendsList = () => {
  const { loading, users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const newChat = (data) => {
    dispatch(startChat({ axiosPrivate, data }));
    dispatch(fetchChats(axiosPrivate));
  };

  useEffect(() => {
    dispatch(fetchUsers(axiosPrivate));
  }, []);

  return (
    <div className="flex flex-col gap-2 bg-white h-64 rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My Friends</p>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-auto overflow-x-hidden">
        {users?.length > 0 ? (
          users?.map((user) => (
            <div
              key={user._id}
              onClick={() => newChat({ userId: user?._id })}
              className="flex flex-row items-center gap-2 p-2 bg-gray-200 rounded-md cursor-pointer"
            >
              <div>
                <img
                  src={avatar}
                  alt={user?.fullname}
                  className="h-12 w-12 rounded-full"
                />
              </div>
              <p className="text-lg font-semibold">{user.fullname}</p>
            </div>
          ))
        ) : (
          <p>no chats to show</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
