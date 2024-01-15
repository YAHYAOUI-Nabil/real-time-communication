import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
const SIGNIN_URL = "/auth/login";

const Singin = () => {
  const { auth, setAuth } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    try {
      const response = await axios.post(SIGNIN_URL, JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setAuth({
        ...auth,
        isAuth: true,
        isValid: true,
        isRegistered: true,
        accessToken: response.data.accessToken,
        fullname: response.data.fullname,
      });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
    }
  };
  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
        <label htmlFor="username">Email *</label>
        <input
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.username ? "border-red-300" : "border-green-100"
          }`}
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
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.password ? "border-red-300" : "border-green-100"
          }`}
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
