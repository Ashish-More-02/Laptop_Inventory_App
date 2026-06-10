import React from "react";
import FeatureCard from "../CommonComponents/FeatureCard";
import { TbCircleNumber1 } from "react-icons/tb";
import { TbCircleNumber2 } from "react-icons/tb";
import { TbCircleNumber3 } from "react-icons/tb";

const HowItWorks = () => {
  return (
    <div className="rounded-4xl bg-[#4e4e4e] border-[0.8px] border-[#333333] mt-6 mx-2 p-4 h-full">
      <h2 className="text-4xl text-center mt-4">How It works</h2>

      {/* steps section */}
      <div className="grid md:grid-cols-3 gap-6 mt-6 sm:px-6">
        <FeatureCard
          Title={"Create your Account now"}
          Description={
            "Signup in Seconds, safely and securely."
          }
          CustomImage={<TbCircleNumber1 />}
          CustomCSS={true}
        ></FeatureCard>
        <FeatureCard
          Title={"Add your Laptops"}
          Description={
            "Enter brand ,specs and price and get started."
          }
          CustomImage={<TbCircleNumber2 />}
          CustomCSS={true}
        ></FeatureCard>
        <FeatureCard
          Title={"Manage Everything"}
          Description={
            "Search, Edit, and track everything from one dashboard."
          }
          CustomImage={<TbCircleNumber3 />}
          CustomCSS={true}
        ></FeatureCard>
      </div>
    </div>
  );
};

export default HowItWorks;
