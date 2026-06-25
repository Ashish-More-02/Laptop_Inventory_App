import React from 'react'
import Sidebar from '../components/Dashboard/Sidebar'
import Topbar from "../components/Dashboard/Topbar";
import StatsSection from "../components/Dashboard/StatsSection";
import MainSection from "../components/Dashboard/MainSection";

const Dashboard = () => {
  return (
    <div className="mx-2">
      <div className="flex flex-col h-[100vh]">
        <Topbar></Topbar>

        <div className="flex flex-row w-full flex-1 min-h-0">
          <Sidebar></Sidebar>
          <div className="flex-1 flex flex-col min-h-0">
            <StatsSection></StatsSection>
            <MainSection></MainSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard