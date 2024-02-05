import React, { useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, startChat, fetchChats } from "../../../api";
import avatar from "../../../data/avatar.png";

const SearchList = () => {
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
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
    <div className="flex flex-col gap-2 bg-white h-[262px] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My Friends</p>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-auto overflow-x-hidden scrollbar-hide">
        {users?.length > 0 ? (
          users
            ?.filter((item) => item.email !== user.email)
            .map((friend) => (
              <div
                key={friend._id}
                onClick={() => newChat({ userId: friend?._id })}
                className="flex flex-row items-center gap-2 p-2 bg-gray-200 rounded-md cursor-pointer"
              >
                <div>
                  <img
                    src={avatar}
                    alt={friend?.fullname}
                    className="h-12 w-12 rounded-full"
                  />
                </div>
                <p className="text-lg font-semibold">{friend.fullname}</p>
              </div>
            ))
        ) : (
          <p>no chats to show</p>
        )}
      </div>
    </div>
  );
};

export default SearchList;
