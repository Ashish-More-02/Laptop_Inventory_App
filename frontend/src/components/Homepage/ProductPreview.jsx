import React from "react";
import DashboardPreview from "../../assets/dashboard-preview.png";

const ProductPreview = () => {
  return (
    <div className="overflow-hidden rounded-4xl bg-[#292929] border-[0.8px] border-[#333333] mt-6 mx-2 p-4 h-full">
      <h2 className="text-4xl text-center mt-4">
        Your Whole inventory, one screen
      </h2>
      <img className="border-[1px] border-[rgb(172,172,172)] rounded-xl sm:rounded-4xl mx-auto mt-10 sm:w-[92%] sm:h-[700px] md:h-full object-cover shadow-2xl/60 shadow-[rgb(230,230,230)]" src={DashboardPreview} alt="Dashboard preview image" />
    </div>
  );
};

export default ProductPreview;
