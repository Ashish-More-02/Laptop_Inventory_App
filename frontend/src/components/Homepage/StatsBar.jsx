import React from "react";
import { MdOutlineLaptop } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoIosFlash } from "react-icons/io";

const StatsBar = () => {
  return (
    <div className="bg-[#102e43] rounded-4xl mx-2 mt-4 p-4 h-[80px] flex justify-around items-center">
      <div className="flex justify-between">
        <MdOutlineLaptop className="text-2xl mr-2" />{" "}
        <div className="text-[16px] sm:text-xl">500+ laptops tracked</div>
      </div>
      <div className="flex justify-between">
        <IoMdTime className="text-2xl mr-2" />{" "}
        <div className="text-[16px] sm:text-xl">99.9% uptime</div>
      </div>
      <div className="flex justify-between">
        <IoIosFlash className="text-2xl mr-2" />{" "}
        <div className="text-[16px] sm:text-xl">Setup in 2 minutes</div>
      </div>
    </div>
  );
};

export default StatsBar;
