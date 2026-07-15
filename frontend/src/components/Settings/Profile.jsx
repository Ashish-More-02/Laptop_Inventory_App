import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useState } from "react";
import { useEffect } from "react";
import NameUpdateForm from "./Forms/NameUpdateFrom";
import Notification from "../CommonComponents/Notification";
import { LuCircleUserRound } from "react-icons/lu";

const Profile = () => {
  const { userData } = useContext(AuthContext);
  console.log(userData);

  // update name form states
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [updatedName, setUpdatedName] = useState("");

  // notification states
  const [showNotification, setShowNotification] = useState(false);
  const [msg, setmsg] = useState("");
  const [isError, setIsError] = useState(false);

  const notify = (data, isErr) => {
    setmsg(data.message || data.error || data.err || "");
    setIsError(isErr);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);

    // data refesh handled by the updateName function itself, no need to do here.
  };

  return (
    <div className="flex-1 min-h-0 w-full mt-2 mb-4 rounded-3xl bg-[#4e4e4e] px-6 py-4">
      <h2 className="font-semibold text-2xl mb-4 text-blue-300 flex flex-row items-center"><LuCircleUserRound className="mr-2 text-white" /> Profile</h2>
      
      <hr className="text-[#787878] h-1 mb-2"/>

      <div className="">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row text-lg sm:text-xl mb-4 items-center">
            <p>Name: </p>
            <div className="bg-[#202020] px-4 py-1 rounded-xl ml-4">
              {userData?.name}
            </div>
          </div>

          <button
            onClick={() => {
              setIsUpdateFormOpen(true);
            }}
            className="hidden sm:block text-nowrap text-lg rounded-3xl px-3 py-1 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer ml-4"
          >
            update name
          </button>
        </div>

        <div className="flex flex-row text-lg sm:text-xl mt-2">
          <p>Email: </p>
          <div className="bg-[#202020] px-4 py-1 rounded-xl ml-4">
            {userData?.email}
          </div>
        </div>
      </div>

      <button
            onClick={() => {
              setIsUpdateFormOpen(true);
            }}
            className="block sm:hidden text-nowrap text-lg rounded-3xl px-3 py-1 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer mt-4 w-full"
          >
            update name
      </button>

      {isUpdateFormOpen ? (
        <NameUpdateForm
          setIsUpdateFormOpen={setIsUpdateFormOpen}
          name={updatedName}
          setUpdatedName={setUpdatedName}
          notify={notify}
        ></NameUpdateForm>
      ) : (
        ""
      )}

      {showNotification ? (
        <Notification
          message={msg}
          backgroundColor={isError ? "bg-red-400" : "bg-green-400"}
        ></Notification>
      ) : (
        ""
      )}
    </div>
  );
};

export default Profile;
