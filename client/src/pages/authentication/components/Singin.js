import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Singin = () => {
  const [validateUserData, setValidateUserData] = useState();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = (data) => {
    setValidateUserData({
      email: data.username,
      password: data.password,
    });
    console.log(data);
  };
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
        <label htmlFor="username">Email *</label>
        <input
          className="focus:outline-none h-9 p-2 rounded-md border-2 border-green-100"
          id="username"
          type="email"
          placeholder="Enter your Email address"
          {...register("username", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "svp entrer un email valide.",
            },
          })}
        />
        <label htmlFor="password">Password *</label>
        <input
          className="focus:outline-none h-9 p-2 rounded-md border-2 border-green-100"
          id="password"
          type="password"
          placeholder="Enter your Password"
          {...register("password", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9]{8,}/,
              message: "minimum 08 caractères",
            },
          })}
        />
        <div className="bg-green-400 rounded-full w-full mt-4">
          <input
            className={`rounded-full w-full px-6 py-2 font-bold text-white cursor-pointer`}
            type="submit"
            // disabled={loading ? true : false}
            value="Signin"
          />
        </div>
      </form>
    </div>
  );
};

export default Singin;
