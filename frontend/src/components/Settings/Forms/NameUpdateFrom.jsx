import React from "react";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { AuthContext } from "../../../context/AuthContext";

const NameUpdateForm = ({ setIsUpdateFormOpen, setUpdatedName, name ,notify }) => {
  const { refreshUserData } = useContext(AuthContext);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const updateName = async () => {
    const responseObj = await fetch(`${BASE_URL}/updatename`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: name || "",
      }),
    });

    const data = await responseObj.json();

    setIsUpdateFormOpen(false);

    // get the new userData again 
    refreshUserData();

    if(data.error){
        notify(data, data.error);
    }
    else{
        notify(data, false);
    }
  };

  return (
    <div className="absolute top-0 left-0 rounded-4xl h-screen w-screen">
      {/* screen overlay bg - blur */}
      <div className="backdrop-blur-sm h-screen w-screen absolute top-0"></div>

      {/* Name update form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateName();
        }}
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-10 relative z-20"
      >
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl">Update Name</h1>
          <IoIosCloseCircleOutline
            className="text-xl bg-red-400 rounded-4xl cursor-pointer"
            onClick={() => {
              setIsUpdateFormOpen(false);
            }}
          />
        </div>

        <p className="text-[#888888]">Enter your updated name and click save</p>

        {/* name */}
        <div className="mt-10 flex flex-col justify-between">
          <label className="text-xl mr-4">Name</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={name}
            placeholder=""
            onChange={(e) => setUpdatedName(e.target.value)}
          />
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

export default NameUpdateForm;
