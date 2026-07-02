import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { LaptopContext } from "../../context/LaptopDataContext";

const StatsSection = () => {
  const { laptopData ,FullResponseFromServer} = useContext(LaptopContext);
  const [totalLaptops, setTotalLaptops] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);

  // console.log(laptopData);

  const CalculateTotalLaptops = () => {
    setTotalLaptops(FullResponseFromServer?.stats?.totalLaptops || 0);
  };

  const CalculateTotalValue = () => {
    setTotalValue(FullResponseFromServer?.stats?.totalPrice || 0);
  };

  const CalculateTotalBrands = () => {
    setTotalBrands(FullResponseFromServer.stats.totalBrands);
  };

  useEffect(() => {
    if (laptopData.length > 0) {
      CalculateTotalLaptops();
      CalculateTotalValue();
      CalculateTotalBrands();
    }
  });

  return (
    <div className="shrink-0 h-[20vh] bg-[#272727] border-[0.8px] border-[#3d3d3d] rounded-4xl flex flex-col">
      <div className="grid grid-cols-3 p-4 flex-1 gap-4">
        <div className="bg-blue-200 h-full w-full rounded-3xl flex flex-col items-center justify-evenly text-black text-2xl font-semibold">
          <p>Total laptops</p>
          <div className="text-indigo-800">{totalLaptops}</div>
        </div>
        <div className="bg-blue-200 h-full w-full rounded-3xl flex flex-col items-center justify-evenly text-black text-2xl font-semibold">
          <p>Value</p>
          <div className="text-indigo-800">$ {totalValue}</div>
        </div>
        <div className="bg-blue-200 h-full w-full rounded-3xl flex flex-col items-center justify-evenly text-black text-2xl font-semibold">
          <p>Brands</p>
          <div className="text-indigo-800">{totalBrands}</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
