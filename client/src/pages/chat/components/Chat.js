import React from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage, fetchMessages } from "../../../api";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const Chat = () => {
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const id = messages[0]?.chat._id;
    const formData = {
      content: data.sms,
      chatId: id,
    };
    dispatch(sendMessage({ axiosPrivate, formData }));
    dispatch(fetchMessages({ axiosPrivate, id }));
    resetField("sms");
  };

  return (
    <div className="flex flex-col justify-between p-2 w-3/4 bg-white h-[100%] rounded-md border-2 border-green-200">
      <p className="text-lg">
        <b>
          {messages[0]?.chat.users
            .map((user) => {
              return user.fullname;
            })
            .find((name) => name !== user.fullname)}
        </b>
      </p>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {messages?.length > 0 &&
            messages?.map((message) =>
              message.sender.fullname === user.fullname ? (
                <div key={message._id} className="flex flex-row justify-end">
                  <div className="w-fit px-2 py-1 bg-green-400 text-white rounded-md">
                    <p>
                      <b>{message?.content}</b>
                    </p>
                  </div>
                </div>
              ) : (
                <div key={message._id} className="flex flex-row justify-start">
                  <div className="w-fit px-2 py-1 bg-gray-400 text-black rounded-md">
                    <p>
                      <b>{message?.content}</b>
                    </p>
                  </div>
                </div>
              )
            )}
        </div>
        <div>
          <form
            className="flex flex-row items-center gap-2"
            onSubmit={handleSubmit(submit)}
          >
            <input
              className={`focus:outline-none w-full h-9 px-2 py-1 rounded-md border-2 border-green-400`}
              id="sms"
              type="text"
              {...register("sms", {
                required: true,
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
    </div>
  );
};

export default Chat;
