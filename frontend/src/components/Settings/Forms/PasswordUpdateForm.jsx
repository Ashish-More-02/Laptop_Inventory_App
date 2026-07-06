import React, { useState } from "react";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { AuthContext } from "../../../context/AuthContext";

const PasswordUpdateForm = ({
  setIsUpdatePasswordFormOpen,
  notify,
  password,
  setPassword,
  currentPassword,
  setCurrentPassword,
}) => {
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const UpdatePassword = async () => {
    const isPasswordValid = validatePassword(password);

    if (isPasswordValid == false) {
      return;
    } else {
      const responseObj = await fetch(`${BASE_URL}/updatepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          newPassword: password,
          currentPassword: currentPassword,
        }),
      });

      const data = await responseObj.json();

      setIsUpdatePasswordFormOpen(false);

      if (data.error) {
        notify(data, data.error);
      } else {
        notify(data, false);
      }
    }


    // reset the password and current password states so that the form shows fresh on every start
    setCurrentPassword("");
    setPassword("");
  };

  // check password ,return true or false
  function validatePassword(pass) {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!passwordRegex.test(pass)) {
      setPasswordErrorMsg(
        "Invalid password, a password should have at least 6 characters, 1 uppercase, 1 lowercase, 1 special char and 1 number",
      );
      return false;
    } else {
      setPasswordErrorMsg("");
      return true;
    }
  }

  return (
    <div className="absolute top-0 left-0 rounded-4xl h-screen w-screen">
      {/* screen overlay bg - blur */}
      <div className="backdrop-blur-sm h-screen w-screen absolute top-0"></div>

      {/* Password update form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          UpdatePassword();
        }}
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-10 relative z-20"
      >
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl">Update Password</h1>
          <IoIosCloseCircleOutline
            className="text-xl bg-red-400 rounded-4xl cursor-pointer"
            onClick={() => {
              setIsUpdatePasswordFormOpen(false);
            }}
          />
        </div>

        <p className="text-[#888888]">
          Enter your current password and updated password{" "}
        </p>

        {/* current password */}
        <div className="mt-10 flex flex-col justify-between">
          <label className="text-xl mr-4">Current password</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={currentPassword}
            placeholder=""
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        {/* new password */}
        <div className="mt-10 flex flex-col justify-between">
          <label className="text-xl mr-4">New password</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={password}
            placeholder=""
            onChange={(e) => {
              setPasswordErrorMsg(false);
              setPassword(e.target.value);
            }}
            onBlur={() => {
              if (password == "") {
                return;
              } else {
                validatePassword(password);
              }
            }}
          />
          {passwordErrorMsg ? (
            <div className="text-red-400">{passwordErrorMsg}</div>
          ) : (
            ""
          )}
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

export default PasswordUpdateForm;
