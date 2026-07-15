import React, { useEffect, useState } from "react";
import { MdLaptop } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { logout, login } = useContext(AuthContext);

  // todo: google search about - "how to check jwt token expiration time on frontend and implement the logic here"

  // only checks if user has logged in previously.
  const checkUserLogin = () => {
    if (localStorage.getItem("token")) {
      setIsUserLoggedIn(true);
    } else {
      setIsUserLoggedIn(false);
    }
  };

  // checks user login status and token expiry 
  const checkUserLoginAndTokenExpiry = () => {
    if (localStorage.getItem("token")) {
      setIsUserLoggedIn(true);

      const token = localStorage.getItem("token");
      // JSON.parse()
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log(payload);

      // console.log(Date.now());

      // exp is in seconds , we need to convert it to milliseconds
      const expiryDate = payload.exp * 1000 < Date.now();

      if (expiryDate) {
        localStorage.removeItem("token");
        logout();
      }
    } else {
      console.log("No token present");
      setIsUserLoggedIn(false);
    }
  };

  useEffect(() => {
    checkUserLoginAndTokenExpiry();
  }, []);

  // smooth-scroll to a homepage section by its id, leaving a 100px gap
  // at the top so the sticky navbar doesn't cover the section heading
  const scrollToSection = (id) => {
    setToggleMenu(false);
    const section = document.getElementById(id);
    if (section) {
      const offset = 100;
      const top =
        section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-0 rounded-4xl backdrop-blur-lg bg-[#292929c6] border-[0.8px]  border-[#333333] m-2">
      <div className="flex justify-between h-[60px] sm:h-[80px]">
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

        {/* quick links - center */}
        <ul className="hidden sm:flex justify-between items-center w-[30%]">
          <div className="relative">
            <li
              onClick={() => scrollToSection("features")}
              className="md:text-lg cursor-pointer rounded-4xl px-4 py-2 after:absolute after:bottom-2 after:left-2 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-[80%]"
            >
              Features
            </li>
          </div>

          <div className="relative">
            <li
              onClick={()=> scrollToSection("pricing")}
              className="md:text-lg cursor-pointer rounded-4xl px-4 py-2 after:absolute after:bottom-2 after:left-2 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-[80%]"
            >
              Pricing
            </li>
          </div>

          <div className="relative">
            <li
              onClick={() => scrollToSection("contact")}
              className="text-nowrap md:text-lg cursor-pointer rounded-4xl px-4 py-2 after:absolute after:bottom-2 after:left-2 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-[80%]"
            >
              Contact us
            </li>
          </div>

          <div className="relative">
            <li
              className="text-nowrap md:text-lg cursor-pointer rounded-4xl px-4 py-2 after:absolute after:bottom-2 after:left-2 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-[80%]"
            >
              About us
            </li>
          </div>
        </ul>

        {isUserLoggedIn ? (
          <div className="hidden sm:flex items-center justify-center">
            <button
              onClick={() => {
                navigate("/dashboard");
              }}
              className="rounded-3xl px-3 sm:px-4 py-1 sm:py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer mr-2"
            >
              Dashboard
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center justify-center">
            {/* login and register buttons */}
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="rounded-3xl px-3 sm:px-4 py-1 sm:py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer mr-2"
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/register");
              }}
              className="rounded-3xl px-3 sm:px-4 py-1 sm:py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer sm:mr-2"
            >
              Register
            </button>
          </div>
        )}

        {/* mobile responsive section - quick items  */}
        <div className="sm:hidden flex items-center justify-center mr-3">
          <IoMenu
            className="text-2xl cursor-pointer"
            onClick={() => {
              setToggleMenu(!toggleMenu);
            }}
          />
        </div>
      </div>

      {toggleMenu ? (
        <div className="mb-2">
          <ul className="flex flex-col justify-between w-full">
            <hr className="w-[94vw] mx-2 border-[1px] border-[#333333]" />
            <li
              onClick={() => scrollToSection("features")}
              className="cursor-pointer hover:bg-[#232323] rounded-4xl px-4 py-2"
            >
              Features
            </li>
            <li
              onClick={() => scrollToSection("pricing")}
              className="cursor-pointer hover:bg-[#232323] rounded-4xl px-4 py-2"
            >
              Pricing
            </li>
            <li
              onClick={() => scrollToSection("contact")}
              className="cursor-pointer hover:bg-[#232323] rounded-4xl px-4 py-2"
            >
              Contact us
            </li>
            <li
              onClick={() => scrollToSection("about")}
              className="cursor-pointer hover:bg-[#232323] rounded-4xl px-4 py-2"
            >
              About us
            </li>
          </ul>
          {/* login and register buttons */}
          {isUserLoggedIn ? (
            <div className="grid grid-cols-1">
              <button
                onClick={() => {
                  navigate("/dashboard");
                }}
                className="rounded-3xl px-3 sm:px-4 py-1 sm:py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer mr-2"
              >
                Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1 px-3">
              <button
                onClick={() => {
                  navigate("/login");
                }}
                className="rounded-3xl px-3 sm:px-4 py-1 sm:py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer mr-2"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                }}
                className="rounded-3xl px-3 sm:px-4 py-1 sm:py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer sm:mr-2"
              >
                Register
              </button>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
