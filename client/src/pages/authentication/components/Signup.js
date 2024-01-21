import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../../api";

const Signup = () => {
  const { loading, response, isRegistered } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const [validateUserData, setValidateUserData] = useState();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    setValidateUserData({
      username: data.username,
      password: data.password,
    });
    if (data.password === data.confirmPassword) {
      dispatch(signup(data));
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
    if (validateUserData) {
      navigate("/validate-account", { state: validateUserData });
    }
  }, [isRegistered]);

  return (
    <div>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(submit)}>
        <label htmlFor="fullname">Name *</label>
        <input
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.fullname || response === "rejected"
              ? "border-red-300"
              : "border-green-100"
          }`}
          id="fullname"
          type="text"
          placeholder="Enter your Name"
          autoComplete="on"
          {...register("fullname", { required: true })}
        />
        <label htmlFor="username">Email *</label>
        <input
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.username || response === "rejected"
              ? "border-red-300"
              : "border-green-100"
          }`}
          id="username"
          type="email"
          placeholder="Enter your Email address"
          autoComplete="on"
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
            errors.password || response === "rejected"
              ? "border-red-300"
              : "border-green-100"
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
        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input
          className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
            errors.confirmPassword || response === "rejected"
              ? "border-red-300"
              : "border-green-100"
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
            className={`rounded-full w-full px-6 py-2 font-bold text-white ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            type="submit"
            disabled={loading ? true : false}
            value="Signup"
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
