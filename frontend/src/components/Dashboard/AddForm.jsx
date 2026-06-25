import React from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

const AddForm = ({
  setIsAddFormOpen,
  notify,
  myname,
  mybrand,
  myram,
  mystorage,
  myprice,
  setAddName,
  setAddBrand,
  setAddPrice,
  setAddRam,
  setAddStorage,
}) => {
  // reset States function
  const ResetAddStates = () => {
    setAddName("");
    setAddBrand("");
    setAddPrice(0);
    setAddRam(0);
    setAddStorage(0);
  };

  // Add New laptop
  const addLaptop = async () => {
    const responseObject = await fetch("http://localhost:3000/api/addlaptop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: myname,
        brand: mybrand.trim().toLowerCase(),
        price: myprice,
        specs: {
          ram: myram,
          Storage: mystorage,
        },
      }),
    });

    const data = await responseObject.json();

    console.log(data);

    // hand the result up to the parent, which owns the notification
    notify(data, !responseObject.ok);

    // reset states before closing the form so that, everytime fresh form appears
    ResetAddStates();

    // close the form — notification still shows because it lives in the parent
    setIsAddFormOpen(false);
  };

  return (
    <div className="absolute top-0 left-0 rounded-4xl h-screen w-screen">
      {/* screen overlay bg - blur */}
      <div className="backdrop-blur-sm h-screen w-screen absolute top-0"></div>

      {/* Add form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addLaptop();
        }}
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-10 relative z-20"
      >
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl">Add Laptop</h1>
          <IoIosCloseCircleOutline
            className="text-xl bg-red-400 rounded-4xl cursor-pointer"
            onClick={() => {
              setIsAddFormOpen(false);
            }}
          />
        </div>

        <p className="text-[#888888]">Enter you laptop details to add</p>

        {/* name */}
        <div className="mt-10 flex flex-col justify-between">
          <label className="text-xl mr-4">Name</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={myname}
            placeholder=""
            onChange={(e) => setAddName(e.target.value)}
          />
        </div>

        {/* brand */}
        <div className="mt-4 flex flex-col justify-between relative">
          <label className="text-xl mr-4">brand</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={mybrand}
            onChange={(e) => setAddBrand(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="mt-4 flex flex-col justify-between relative">
          <label className="text-xl mr-4">Price</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="number"
            value={myprice}
            onChange={(e) => setAddPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-row">
          {/* Ram */}
          <div className="mt-4 flex flex-col justify-between relative mr-2">
            <label className="text-xl mr-4">
              Ram <span className="text-[#888888] text-sm">in GB</span>
            </label>
            <input
              className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
              type="number"
              value={myram}
              onChange={(e) => setAddRam(e.target.value)}
            />
          </div>

          {/* Storage */}
          <div className="mt-4 flex flex-col justify-between relative">
            <label className="text-xl mr-4">
              Storage <span className="text-[#888888] text-sm">in GB</span>
            </label>
            <input
              className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
              type="number"
              value={mystorage}
              onChange={(e) => setAddStorage(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center w-full ">
          <button
            className="w-full px-4 py-2 text-xl bg-[#b0b0b0] text-black rounded-xl cursor-pointer"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddForm;
