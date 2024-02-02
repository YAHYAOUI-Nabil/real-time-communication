import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../api";
import avatar from "../../../data/avatar.png";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const [showBtn, setShowBtn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const logoutUser = () => {
    dispatch(logout());
  };
  return (
    <div className="h-12">
      <div className="flex flex-row justify-between items-center w-full h-12 px-4 bg-white border-2 border-green-200">
        <div>
          <FaSearch />
        </div>
        <p className="text-center text-xl uppercase font-bold text-green-400">
          IJA-NAHKIW
        </p>
        <div className="flex flex-row gap-3 items-center">
          <div className="relative cursor-pointer">
            {notifications?.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 h-5 w-5 rounded-full text-white text-xs font-semibold flex justify-center items-center">
                <p>{notifications?.length}</p>
              </div>
            )}
            <MdNotifications className="h-6 w-6 text-green-400" />
          </div>
          <div
            className="flex gap-1 cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            <img
              src={avatar}
              alt={user.fullname}
              className="h-6 w-6 rounded-full"
            />
            <p className="font-semibold cursor-pointer">{user.fullname}</p>
          </div>

          <MdKeyboardArrowDown
            onClick={() => setShowBtn(!showBtn)}
            className="h-6 w-6 text-green-400"
          />
        </div>
      </div>
      <div
        className={`${!showBtn && "hidden"} w-full flex justify-end absolute`}
      >
        <button
          className="px-2 py-1 bg-green-400 text-white font-semibold rounded-md"
          onClick={() => logoutUser()}
        >
          logout
        </button>
      </div>
      {showProfile && (
        <div className="fixed z-90 top-0 bg-black/50 w-full h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 w-80 bg-white rounded-md p-2">
            <p className="text-center font-semibold text-lg">{user.fullname}</p>
            <img
              src={avatar}
              alt={user.fullname}
              className="h-20 w-20 rounded-full"
            />
            <p className="text-center font-semibold">Email: {user.email}</p>
            <div className="flex justify-end items-end w-full">
              <button
                onClick={() => setShowProfile(false)}
                className="px-2 py-1 rounded-md bg-green-400 text-white font-semibold"
              >
                close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
