import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";

const Sidebar = ({ActiveState}) => {
  const [isActive, setIsActive] = useState(ActiveState);
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    setIsActive(1);
    navigate("/dashboard");
  };

  const handleSettingsClick = () => {
    setIsActive(3);
    navigate("/settings");
  };

  const baseItem = "rounded-2xl px-4 py-2 text-lg cursor-pointer flex items-center";

  return (
    <div className="hidden sm:block w-[18%] max-w-[320px] bg-[#174160] rounded-4xl px-2 py-4">
      <div className="grid grid-cols-1 gap-4">
        <div
          onClick={handleDashboardClick}
          className={`${baseItem} ${isActive === 1 ? "bg-[#326990]" : "hover:bg-[#326990]"}`}
        >
          <LuLayoutDashboard className="text-xl mr-2"/> Dashboard
        </div>
        <div
          onClick={handleSettingsClick}
          className={`${baseItem} ${isActive === 3 ? "bg-[#326990]" : "hover:bg-[#326990]"}`}
        >
          <MdOutlineSettings className="text-xl mr-2"/> Settings
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
