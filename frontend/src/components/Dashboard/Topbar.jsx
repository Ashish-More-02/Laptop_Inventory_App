import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MdLaptop } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();
  const {logout} = useContext(AuthContext);

  return (
    <div className="h-[8vh] bg-[#272727] border-[0.8px] border-[#3d3d3d] rounded-4xl flex flex-row items-center my-3">
      <div className="flex flex-row justify-between w-full">
        {/* App name and icon */}
        <div
          onClick={() => {
            navigate("/");
          }}
          className="flex cursor-pointer items-center ml-4"
        >
          <MdLaptop className="text-lg sm:text-2xl"></MdLaptop>
          <div className="sm:text-xl ml-3">Laptop Inventory App</div>
        </div>

        {/* Search and Logout button */}
        <div className="mr-4">
          <input
            className="focus:outline-none border-2 border-[#3d3d3d] rounded-3xl px-4 py-1"
            type="text"
            placeholder="Search"
          />
          <button className="rounded-3xl px-3 sm:px-4 py-1 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer ml-4" onClick={()=>{
            logout();
            navigate("/");
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
