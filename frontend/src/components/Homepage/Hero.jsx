import React from "react";
import HeroImage from "../../assets/hero-laptops.jpg"
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="sm:h-[70vh] bg-[#174160] rounded-4xl mx-2 mt-4 p-4 flex flex-col sm:flex-row items-center justify-center">
      {/* left section - text */}
      <div className="w-full sm:w-1/2">
        {/* heading */}
        <h1 className="text-5xl text-center sm:text-left sm:text-7xl">
          Every laptop your business owns - <span>in one dashboard</span>
        </h1>

        {/* sub-heading */}
        <p className="text-xl text-center sm:text-left mt-4">
          Add, search, and manage your entire laptop inventory - brand, specs,
          price, and stock - without spreadsheets.
        </p>

        {/* CTA buttons */}
        <div className="m-4 sm:mt-4 sm:mb-0 sm:ml-0 flex justify-center items-center sm:block">
          <button
            onClick={() => {
              navigate("/register");
            }}
            className="rounded-3xl px-4 py-2 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer mr-2 hover:bg-[#3a6eb2] "
          >
            Get Started
          </button>
          <button
            onClick={() => {
              // redirect to contact page later.
            }}
            className="rounded-3xl px-4 py-2 bg-[#515151] border-[1px] border-[#396296] cursor-pointer sm:mr-2 hover:bg-[#5e5e5e]"
          >
            Contact us
          </button>
        </div>
      </div>

      {/* right section - dashboard image */}
      <div className="w-full sm:w-1/2">
        <img className="rounded-4xl" src={HeroImage} alt="Hero image" />
      </div>
    </div>
  );
};

export default Hero;
