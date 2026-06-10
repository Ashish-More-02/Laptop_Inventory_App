import React from "react";
import DashboardPreview from "../../assets/dashboard-preview.jpg";

const ProductPreview = () => {
  return (
    <div className="rounded-4xl bg-[#292929] border-[0.8px] border-[#333333] mt-6 mx-2 p-4 h-full">
      <h2 className="text-4xl text-center mt-4">
        Your Whole inventory, one screen
      </h2>
      <img className="rounded-4xl mx-auto mt-10 sm:w-[90%] sm:h-[700px] object-cover" src={DashboardPreview} alt="Dashboard preview image" />
    </div>
  );
};

export default ProductPreview;
