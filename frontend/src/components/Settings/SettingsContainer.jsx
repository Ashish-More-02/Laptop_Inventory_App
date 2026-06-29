import React from "react";
import Profile from "./Profile";
import Security from "./Security";

const SettingsContainer = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#272727] border-[0.8px] border-[#3d3d3d] rounded-4xl m-2 min-h-0">
      {/* top bar - currently empty*/}
      <div className="flex justify-between px-4 mt-4">
        <div className="bg-[#212121] flex-1 mr-4 rounded-xl"></div>
      </div>

      <div className="box-border px-4">
        {/* 1. Profile section */}
        <Profile></Profile>
        <Security></Security>
      </div>
    </div>
  );
};

export default SettingsContainer;
