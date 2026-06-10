import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const FinalCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="sm:h-[20vh] bg-[#174160] rounded-4xl mx-2 mt-6 p-4 flex flex-col items-center justify-center">
      <h2 className="text-4xl text-center">Ready to organise your laptop inventory?</h2>
      <button
        onClick={() => {
          navigate("/register");
        }}
        className="flex items-center justify-center mt-4 rounded-3xl px-4 py-2 text-[#284469] font-semibold bg-[#a5ccff] border-[1px] border-[#396296] cursor-pointer mr-2 hover:bg-[rgb(146,193,255)] "
      >
        Get Started now <FaArrowRight className="ml-2"/>
      </button>
    </div>
  );
};

export default FinalCTA;
