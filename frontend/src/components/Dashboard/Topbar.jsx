import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { MdLaptop } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";

const Topbar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [windowSize,setWindowSize] = useState(0);

  // tracking the window resise event 
  // so that if someone keeps the mobile menu open and resize the window it shoud not glitch out, and stay in sync
  window.addEventListener("resize",()=>{
    setWindowSize(window.innerWidth);

    if(windowSize>=400){
      setShowMobileMenu(false);
    }
  });

  return (
    <div className="sticky top-0 sm:h-[8vh] bg-[#272727] border-[0.8px] border-[#3d3d3d] rounded-4xl flex flex-col justify-center my-3">
      <div className="h-[60px] flex flex-row justify-between w-full">
        <div className="flex flex-row justify-between w-full ">
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
          <div className="flex flex-row items-center">
            <div className="mr-4">
              <input
                className="hidden sm:inline focus:outline-none border-2 border-[#3d3d3d] rounded-3xl px-4 py-1"
                type="text"
                placeholder="Search"
              />
              <button
                className="rounded-3xl px-3 sm:px-4 py-1 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer ml-4"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>

            <IoMenu
              onClick={() => {
                setShowMobileMenu(!showMobileMenu);
              }}
              className="block sm:hidden text-2xl mr-2 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* mobile menu */}
      {showMobileMenu ? (
        <div className="mb-2">
          <ul className="flex flex-col justify-between w-full">
            <hr className="w-[94vw] mx-2 border-[1px] border-[#333333]" />
            <li className="cursor-pointer hover:bg-[#232323] rounded-4xl px-4 py-2" onClick={()=>navigate("/dashboard")}>
              Dashboard
            </li>
            <li className="cursor-pointer hover:bg-[#232323] rounded-4xl px-4 py-2" onClick={()=>navigate("/settings")}>
              Settings
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Topbar;
