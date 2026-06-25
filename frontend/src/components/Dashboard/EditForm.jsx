import React, { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

const EditForm = ({
  setIsEditFormOpen,
  notify,
  laptopID,
  myname,
  mybrand,
  myram,
  mystorage,
  myprice,
}) => {
  const [name, setName] = useState(myname);
  const [brand, setBrand] = useState(mybrand);
  const [price, setPrice] = useState(myprice);
  const [ram, setRam] = useState(myram);
  const [storage, setStorage] = useState(mystorage);

  // Edit laptop data
  const EditLaptop = async (id) => {
    const responseObject = await fetch(
      `http://localhost:3000/api/updatelaptop/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          data: {
            name: name,
            brand: brand,
            price: price,
            specs: { ram: ram, Storage: storage },
          },
        }),
      },
    );

    const data = await responseObject.json();

    console.log(data);

    // hand the result up to the parent, which owns the notification
    notify(data, !responseObject.ok);

    // close the form — notification still shows because it lives in the parent
    setIsEditFormOpen(false);
  };

  return (
    <div className="absolute top-0 left-0 rounded-4xl h-screen w-screen">
      {/* screen overlay bg - blur */}
      <div className="backdrop-blur-sm h-screen w-screen absolute top-0"></div>

      {/* Edit form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          EditLaptop(laptopID);
        }}
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-10 relative z-20"
      >
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl">Edit Laptop</h1>
          <IoIosCloseCircleOutline
            className="text-xl bg-red-400 rounded-4xl cursor-pointer"
            onClick={() => {
              setIsEditFormOpen(false);
            }}
          />
        </div>

        <p className="text-[#888888]">
          Enter your Details below to login your account in Laptop Inventory App
        </p>

        {/* name */}
        <div className="mt-10 flex flex-col justify-between">
          <label className="text-xl mr-4">Name</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={name}
            placeholder=""
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* brand */}
        <div className="mt-4 flex flex-col justify-between relative">
          <label className="text-xl mr-4">brand</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="mt-4 flex flex-col justify-between relative">
          <label className="text-xl mr-4">Price</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
              type="text"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
            />
          </div>

          {/* Storage */}
          <div className="mt-4 flex flex-col justify-between relative">
            <label className="text-xl mr-4">
              Storage <span className="text-[#888888] text-sm">in GB</span>
            </label>
            <input
              className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
              type="text"
              value={storage}
              onChange={(e) => setStorage(e.target.value)}
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

export default EditForm;
