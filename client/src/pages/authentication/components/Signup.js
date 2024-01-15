import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";
import useAuth from "../../../hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
const SIGNUP_URL = "/user";

const Signup = () => {
  const { auth, setAuth } = useAuth();
  const [errMsg, setErrMsg] = useState("");
  const [validateUserData, setValidateUserData] = useState();
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    if (data.password === data.confirmPassword) {
      try {
        const response = await axios.post(SIGNUP_URL, JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setValidateUserData({
          username: data.username,
          password: data.password,
        });
        const accessToken = response?.data?.accessToken;
        const roles = response?.data?.roles;
        setAuth({ roles, accessToken });
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
        // errRef.current.focus();
      }
    } else {
      setError("password", {
        type: "manual",
        message: "password not match",
      });
      setError("confirmPassword", {
        type: "manual",
        message: "password not match",
      });
    }
  };

  useEffect(() => {
    console.log("first");
    if (validateUserData) {
      navigate("/validate-account", { state: validateUserData });
    }
  }, [auth]);

  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
        <label htmlFor="identifier">Name *</label>
        <input
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.fullname ? "border-red-300" : "border-green-100"
          }`}
          id="fullname"
          type="text"
          placeholder="Enter your Name"
          {...register("fullname", { required: true })}
        />
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
        <label htmlFor="password">Confirm Password *</label>
        <input
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.confirmPassword ? "border-red-300" : "border-green-100"
          }`}
          id="confirmPassword"
          type="password"
          placeholder="Confirm your Password"
          {...register("confirmPassword", {
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
            value="Signup"
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
