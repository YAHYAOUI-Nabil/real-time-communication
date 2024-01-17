import React from "react";
import { FaSearch } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../api";

const Navbar = () => {
  const dispatch = useDispatch();
  const logoutUser = () => {
    dispatch(logout());
  };
  return (
    <div className="flex flex-row justify-between items-center w-full h-12 px-4 bg-white border-2 border-green-200">
      <div>
        <FaSearch />
      </div>
      <p className="text-center text-xl uppercase font-bold text-green-400">
        IJA-NAHKIW
      </p>
      <div className="flex flex-row gap-1">
        <MdNotifications />
        <MdKeyboardArrowDown />
        <button onClick={() => logoutUser()}>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
