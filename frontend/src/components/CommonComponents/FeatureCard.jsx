import React from "react";

const FeatureCard = ({ Icon, Title, Description ,CustomImage,CustomCSS}) => {
  return (
    <div className="bg-[#1b1b1b] w-full p-4 rounded-4xl h-[300px] border-[0.9px] border-[#414141]">
      <div className="text-[80px] text-center w-fit mx-auto">{CustomImage}</div>
      <div className={CustomCSS? "flex justify-center":"flex"}>
        <div>{Icon}</div>
        <div className="text-2xl ml-2 text-[#79c7ff]">{Title}</div>
      </div>

      {/* description */}
      <div className={CustomCSS? "text-xl mt-8 text-center": "text-xl mt-8"}>{Description}</div>
    </div>
  );
};

export default FeatureCard;