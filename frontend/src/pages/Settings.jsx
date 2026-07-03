import React from "react";
import Sidebar from '../components/Dashboard/Sidebar'
import Topbar from "../components/Dashboard/Topbar";
import SettingsContainer from "../components/Settings/SettingsContainer";

const Settings = () => {
  return (
    <div>
      <div className="mx-2">
        <div className="flex flex-col h-[100vh]">
          <Topbar></Topbar>

          <div className="flex flex-row w-full flex-1 min-h-0">
            <Sidebar ActiveState={3}></Sidebar>
            <div className="flex-1 flex flex-col min-h-0 w-[90vw] sm:w-full">
              {/* settings page goes here */}
                <SettingsContainer></SettingsContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
