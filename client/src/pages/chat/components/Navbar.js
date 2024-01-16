import React from "react";
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex flex-row justify-center items-center w-full h-12 bg-white border-2 border-green-200">
      <div>
        <FaSearch />
      </div>
      <p className="text-center text-xl uppercase font-bold text-green-400">
        IJA-NAHKIW
      </p>
    </div>
  );
};

export default Navbar;
