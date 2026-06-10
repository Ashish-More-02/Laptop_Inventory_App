import React from "react";
import { MdLaptop } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { HiOutlineAtSymbol } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-4xl bg-[#292929] border-[0.8px] border-[#333333] mt-6 mx-2 p-4 h-full">
      {/* 3 columns of links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 mb-10">
        {/* product */}
        <div className="flex flex-col items-center">
          <div>
            <h2 className="text-2xl mb-4 text-blue-400">Product</h2>
            <ul>
              <li className="cursor-pointer hover:underline">Login</li>
              <li className="cursor-pointer hover:underline">Register</li>
              <li className="cursor-pointer hover:underline">Features</li>
              <li className="cursor-pointer hover:underline">Pricing</li>
            </ul>
          </div>
        </div>
        {/* Resources */}
        <div className="flex flex-col items-center">
          <div>
            <h2 className="text-2xl mb-4 text-blue-400">Resources</h2>
            <ul>
              <li className="cursor-pointer hover:underline">Github</li>
              <li className="cursor-pointer hover:underline">Docs</li>
              <li className="cursor-pointer hover:underline">Contact us</li>
              <li className="cursor-pointer hover:underline">About us</li>
            </ul>
          </div>
        </div>
        {/* Legal */}
        <div className="flex flex-col items-center">
          <div>
            <h2 className="text-2xl mb-4 text-blue-400">Legal</h2>
            <ul>
              <li className="cursor-pointer hover:underline">Privacy policy</li>
              <li className="cursor-pointer hover:underline">Terms</li>
            </ul>
          </div>
        </div>
        {/* Socials */}
        <div className="flex flex-col items-center">
          <div>
            <h2 className="text-2xl mb-4 text-blue-400">Socials</h2>
            <ul>
              <li className="cursor-pointer flex flex-row items-center hover:underline"><FaGithub className="mr-2"/> Github</li>
              <li className="cursor-pointer flex flex-row items-center hover:underline"><FaLinkedin className="mr-2"/> LinkedIn</li>
              <li className="cursor-pointer flex flex-row items-center hover:underline"><FaSquareXTwitter className="mr-2"/> Twitter</li>
            </ul>
          </div>
        </div>
      </div>

      {/* end line */}
      <div className="flex flex-row justify-center items-center text-[#c7c7c7]">
        <div className="flex flex-row items-center">
          <HiOutlineAtSymbol /> 2026
        </div>
        <div
          onClick={() => {
            navigate("/");
          }}
          className="flex cursor-pointer items-center ml-4"
        >
          <MdLaptop className="text-xl"></MdLaptop>
          <div className="text-lg ml-3">Laptop Inventory App</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
