import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

const DeleteConfirmation = ({setIsDeleteConfirmationOpen ,deleteLaptop,laptopID}) => {
  return (
    <div className="absolute top-0 left-0 rounded-4xl h-screen w-screen">
      {/* screen overlay bg - blur */}
      <div className="backdrop-blur-sm h-screen w-screen absolute top-0"></div>

      {/* Add form */}
      <form
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-[20%] relative z-20"
      >
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl">Delete Laptop</h1>
          <IoIosCloseCircleOutline
            className="text-xl bg-red-400 rounded-4xl cursor-pointer"
            onClick={() => {
              setIsDeleteConfirmationOpen(false);
            }}
          />
        </div>

        <p className="text-[#888888]">Are you sure you want to delete this laptop</p>

        <div className="mt-10 flex items-center justify-center w-full ">
          <button
            className="w-full px-4 py-2 text-xl bg-[#b0b0b0] text-black rounded-xl cursor-pointer mr-2"
            type="button"
            onClick={()=>{
                setIsDeleteConfirmationOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="w-full px-4 py-2 text-xl bg-[#9c3333] text-white rounded-xl cursor-pointer"
            type="button"
            onClick={(e)=>{
                e.preventDefault();
                deleteLaptop(laptopID)
            }}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteConfirmation;
