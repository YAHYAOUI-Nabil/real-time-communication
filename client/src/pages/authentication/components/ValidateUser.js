import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../../../api/axios";

import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import useAuth from "../../../hooks/useAuth";
const VALIDATE_USER_URL = "/user/validate-user";

const ValidateUser = () => {
  const [errMsg, setErrMsg] = useState("");
  const { auth, setAuth } = useAuth();
  const { state } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {
    const formData = {
      username: state.username,
      password: state.password,
      authCode: data.verification,
    };
    try {
      const response = await axios.post(
        VALIDATE_USER_URL,
        JSON.stringify(formData),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      setAuth({
        ...auth,
        isAuth: true,
        isValid: true,
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
    <>
      {!auth?.isAuth && auth?.isRegistered && !auth.isValid ? (
        <div className="flex flex-col gap-4 justify-center items-center h-screen w-full">
          <Header />
          <div className="flex flex-col gap-4 w-1/3 h-3/4 bg-white rounded-md border-2 border-green-200 p-4">
            <p>
              Un code de vérification a été envoyé pour votre addresse email.
              svp taper le code pour valider votre compte.
            </p>
            <div className="mt-8">
              <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(submit)}
              >
                <label htmlFor="verification">Code de vérification</label>
                <input
                  className={`focus:outline-none h-9 p-2 rounded-md border-2 ${
                    errors.verification ? "border-red-300" : "border-green-100"
                  }`}
                  id="verification"
                  type="text"
                  {...register("verification", {
                    required: true,
                    pattern: {
                      value: /^[0-9]{6,}/,
                      message: "Le code est un nombre de six chiffres",
                    },
                  })}
                />
                <div className="bg-green-400 rounded-full w-full mt-4">
                  <input
                    className={`rounded-full w-full px-6 py-2 font-bold text-white cursor-pointer`}
                    type="submit"
                    value="Valider"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to={"/chat"} />
      )}
    </>
  );
};

export default ValidateUser;
