import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  deleteNotification,
  accessChat,
  fetchNotifications,
} from "../../../api";
import avatar from "../../../data/avatar.png";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [showBtn, setShowBtn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const logoutUser = () => {
    dispatch(logout());
  };

  const displayNotification = ({ notifId, id }) => {
    dispatch(deleteNotification({ axiosPrivate, notifId }));
    dispatch(accessChat({ axiosPrivate, id }));
    // dispatch(fetchNotifications(axiosPrivate));
    setShowNotifications(false);
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
          <div className="relative">
            {notifications?.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 h-5 w-5 rounded-full text-white text-xs font-semibold flex justify-center items-center">
                <p>{notifications?.length}</p>
              </div>
            )}
            <MdNotifications
              className="h-6 w-6 text-green-400 cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            <div
              className={`absolute right-0 ${
                showNotifications ? "flex flex-col" : "hidden"
              } gap-2 bg-gray-200 p-2 w-80 rounded-md`}
            >
              {notifications?.length > 0 ? (
                <>
                  {notifications?.map((notification) => (
                    <div
                      className="flex items-center gap-2 p-1 bg-white rounded-md cursor-pointer"
                      key={notification._id}
                      onClick={() =>
                        displayNotification({
                          notifId: notification._id,
                          id: notification.chat._id,
                        })
                      }
                    >
                      <div>
                        <img
                          src={avatar}
                          alt={notification.sender.fullname}
                          className="h-12 w-12 rounded-full"
                        />
                      </div>
                      <div className="w-max">
                        <p className="font-semibold">
                          {notification.sender.fullname}
                        </p>
                        <p>
                          {notification?.latestMessage.content.length > 30
                            ? notification?.latestMessage.content.substring(
                                0,
                                30
                              ) + "..."
                            : notification?.latestMessage.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex items-center p-1 bg-white rounded-md">
                  <p>No notifications to show</p>
                </div>
              )}
            </div>
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
            className="h-6 w-6 text-green-400 cursor-pointer"
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
