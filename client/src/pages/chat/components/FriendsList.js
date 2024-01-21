import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../api";

const USERS_URL = "/chat";

const FriendsList = () => {
  const { loading, users } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [chatsList, setChatsList] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    // const fetchNote = async () => {
    //   try {
    //     const response = await axiosPrivate.get(USERS_URL);
    //     setChatsList(response.data);
    //   } catch (err) {
    //     console.log(err.response);
    //   }
    // };
    // fetchNote();
    dispatch(fetchUsers(axiosPrivate));
  }, []);
  return (
    <div className="flex flex-col gap-2 bg-white h-[50%] rounded-md border-2 border-green-200">
      <div className="flex flex-row items-center p-2 justify-between">
        <p className="text-xl font-medium">My Friends</p>
      </div>
      <div className="p-2">
        {users?.length > 0 ? (
          users?.map((user) => (
            <div key={user._id} className="p-2 bg-gray-200 rounded-md">
              <p>{user.fullname}</p>
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
