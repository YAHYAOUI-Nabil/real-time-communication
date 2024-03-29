import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../../../api";

const Search = ({ showSearchInput, setShowSearchInput }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    dispatch(fetchUsers({ axiosPrivate, search: searchQuery }));
  }, [searchQuery]);

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="">
      <form className="flex flex-row items-center gap-2 w-full">
        {!showSearchInput ? (
          <FaSearch
            className="cursor-pointer h-5 w-5"
            onClick={() => setShowSearchInput(!showSearchInput)}
          />
        ) : (
          <div className="flex flex-row items-center gap-2 w-full">
            <IoClose
              className="cursor-pointer h-6 w-6"
              onClick={() => {
                setShowSearchInput(!showSearchInput);
                setSearchQuery("");
              }}
            />
            <input
              className={`focus:outline-none w-full h-8 px-2 py-1 rounded-md border-2 border-green-400`}
              id="search"
              type="text"
              placeholder="search friends"
              onChange={handleSearchQuery}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;
