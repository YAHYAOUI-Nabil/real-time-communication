import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, fetchMessages, fetchChats } from "../../../api";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import io from "socket.io-client";
var socket, selectedChatCompare;

const Chat = () => {
  const { messages, message } = useSelector((state) => state.message);
  const { chat } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const id = chat?._id;

  const submit = async (data) => {
    const formData = {
      content: data.sms,
      chatId: id,
    };
    socket.emit("stop typing", chat?._id);
    dispatch(sendMessage({ axiosPrivate, formData }));
    resetField("sms");
  };

  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    if (chat) {
      dispatch(fetchMessages({ axiosPrivate, id }));
      socket.emit("join chat", chat._id);
      selectedChatCompare = chat;
    }
  }, [chat, message]);

  useEffect(() => {
    if (message) {
      socket.emit("new message", message);
      dispatch(fetchChats(axiosPrivate));
    }
  }, [message]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        console.log("Notify me with messages recieved");
      } else {
        dispatch(
          fetchMessages({ axiosPrivate, id: newMessageReceived.chat._id })
        );
      }
      dispatch(fetchChats(axiosPrivate));
    });
  }, []);

  const typingHandler = () => {
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", chat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", chat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="p-2 w-3/4 bg-white h-[532px] rounded-md border-2 border-green-200">
      {chat ? (
        <div
          className={`flex flex-col ${
            messages ? "justify-between" : "justify-end"
          } gap-2`}
        >
          {messages && (
            <div
              className={`${
                istyping ? "h-[424px]" : "h-[464px]"
              } flex flex-col justify-between gap-2`}
            >
              <p className="text-lg">
                <b>
                  {messages[0]?.chat?.users
                    .map((user) => {
                      return user.fullname;
                    })
                    .find((name) => name !== user.fullname)}
                </b>
              </p>
              <div className="flex flex-col gap-4 overflow-auto scrollbar-hide">
                <div className="flex flex-col gap-2">
                  {messages?.map((message) =>
                    message.sender.fullname === user.fullname ? (
                      <div
                        key={message._id}
                        className="flex flex-row justify-end"
                      >
                        <div className="w-fit px-2 py-1 bg-green-400 text-white rounded-md">
                          <p>
                            <b>{message?.content}</b>
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={message._id}
                        className="flex flex-row justify-start"
                      >
                        <div className="w-fit px-2 py-1 bg-gray-400 text-black rounded-md">
                          <p>
                            <b>{message?.content}</b>
                          </p>
                        </div>
                      </div>
                    )
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </div>
          )}
          <div
            className={`${
              istyping ? "h-[66px]" : "h-[36px]"
            } flex flex-col justify-between w-full`}
          >
            {istyping ? (
              <div className="w-full">
                <p className="text-base text-green-500">typing...</p>
              </div>
            ) : (
              <></>
            )}
            <form
              className="flex flex-row items-center gap-2 w-full"
              onSubmit={handleSubmit(submit)}
            >
              <input
                className={`focus:outline-none w-full h-9 px-2 py-1 rounded-md border-2 border-green-400`}
                id="sms"
                type="text"
                placeholder="Enter a message.."
                {...register("sms", {
                  required: true,
                  onChange: () => {
                    typingHandler();
                  },
                })}
              />
              <div className="bg-green-400 rounded-full">
                <input
                  className={`rounded-full px-4 py-1 font-bold text-white cursor-pointer`}
                  type="submit"
                  value="send"
                />
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <p>Click on a user to start chatting</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
