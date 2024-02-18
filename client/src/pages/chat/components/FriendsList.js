import React, { useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  startChat,
  fetchChats,
  addFriend,
  removeFriend,
} from "../../../api";
import avatar from "../../../data/avatar.png";

const FriendsList = () => {
  const { users, friends } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const newChat = (data) => {
    dispatch(startChat({ axiosPrivate, data }));
    dispatch(fetchChats(axiosPrivate));
  };

  const removeFromFriendList = (id) => {
    dispatch(removeFriend({ axiosPrivate, id }));
  };

  const addToFriendList = (id) => {
    dispatch(addFriend({ axiosPrivate, id }));
  };

  useEffect(() => {
    dispatch(fetchUsers({ axiosPrivate, search: "" }));
  }, [friends]);

  return (
    <div className="flex flex-col gap-2 bg-white sm:h-[262px] h-[46vh] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My Friends</p>
      </div>
      <div className="flex flex-col gap-2 p-2 overflow-auto overflow-x-hidden scrollbar-hide">
        {users?.filter((item) => item.email !== user.email)?.length > 0 ? (
          users
            ?.filter((item) => item.email !== user.email)
            .map((friend) => (
              <div
                key={friend._id}
                className="flex flex-row items-center justify-between gap-2 p-2 bg-gray-200 rounded-md"
              >
                <div
                  className="flex flex-row items-center gap-2 cursor-pointer"
                  onClick={() => newChat({ userId: friend?._id })}
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
                {!friend?.friends?.includes(user.id) ? (
                  <div className="p-2 rounded-md bg-green-400 text-white font-semibold">
                    <button onClick={() => addToFriendList(friend?._id)}>
                      add
                    </button>
                  </div>
                ) : (
                  <div className="p-2 rounded-md bg-red-400 text-white font-semibold">
                    <button onClick={() => removeFromFriendList(friend?._id)}>
                      remove
                    </button>
                  </div>
                )}
              </div>
            ))
        ) : (
          <p>no friends to show</p>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
