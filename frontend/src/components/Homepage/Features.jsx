import React from "react";
import { MdOutlineLaptop } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import FeatureCard from "../CommonComponents/FeatureCard";


const Features = () => {
  return (
    <div className="rounded-4xl bg-[#292929] border-[0.8px] border-[#333333] mt-6 mx-2 p-4 h-full">
      <h2 className="text-4xl text-center mt-4">Why Use this</h2>

      {/* <hr className="border-[1px] mt-4 border-[#525252]"/> */}

      {/* Cards section */}
      <div className="grid md:grid-cols-3 gap-6 mt-6 sm:px-6">
        <FeatureCard
          Icon={<MdOutlineLaptop className="text-3xl" />}
          Title={"Full inventory at a glance"}
          Description={
            "See every laptop with brand, specs and price in one list."
          }
        ></FeatureCard>
        <FeatureCard
          Icon={<IoMdTime className="text-3xl" />}
          Title={"Add in seconds"}
          Description={
            "Register a new laptop with name, brand, price and specs."
          }
        ></FeatureCard>
        <FeatureCard
          Icon={<IoSearch className="text-3xl" />}
          Title={"Search & filter"}
          Description={"Find Any device fast, within seconds"}
        ></FeatureCard>
        <FeatureCard
          Icon={<MdOutlineSecurity className="text-3xl" />}
          Title={"Secure & private"}
          Description={
            "JWT-protected — only you can see and edit your inventory."
          }
        ></FeatureCard>
        <FeatureCard
          Icon={<FaRegEdit className="text-3xl" />}
          Title={"Edit & update"}
          Description={
            "Update prices or specs anytime; changes save instantly."
          }
        ></FeatureCard>
        <FeatureCard
          Icon={<RiDeleteBin6Line className="text-3xl" />}
          Title={"Clean up easily"}
          Description={"Remove laptops you no longer own, owner-scoped & safe."}
        ></FeatureCard>
      </div>
    </div>
  );
};

export default Features;
