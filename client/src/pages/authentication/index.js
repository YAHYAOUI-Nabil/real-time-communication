import React, { useState } from "react";
import Header from "./components/Header";
import Signup from "./components/Signup";
import Singin from "./components/Singin";
import useAuth from "../../hooks/useAuth";

const Index = () => {
  const { toggle, setToggle } = useAuth();

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen w-full">
      <Header />
      <div className="flex flex-col gap-4 w-1/3 h-3/4 bg-white rounded-md border-2 border-green-200 p-4">
        <div className="flex justify-between gap-2">
          <button
            onClick={() => setToggle("signin")}
            className={`${
              toggle === "signin" ? "bg-green-400 text-white" : "text-green-400"
            }  px-4 py-2  rounded-full w-full`}
          >
            Signin
          </button>
          <button
            onClick={() => setToggle("signup")}
            className={`${
              toggle === "signup" ? "bg-green-400 text-white" : "text-green-400"
            } px-4  rounded-full w-full`}
          >
            Signup
          </button>
        </div>
        {toggle === "signin" ? <Singin /> : <Signup />}
      </div>
    </div>
  );
};

export default Index;
