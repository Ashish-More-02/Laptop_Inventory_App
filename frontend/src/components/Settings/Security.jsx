import React, { useState } from "react";
import PasswordUpdateForm from "./Forms/PasswordUpdateForm";
import Notification from "../CommonComponents/Notification";

const Security = () => {
  const [isUpdatePasswordFormOpen, setIsUpdatePasswordFormOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

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
    <div className="flex-1 min-h-0 w-full my-2 rounded-3xl bg-[#4e4e4e] px-6 py-4">
      <h2 className="font-semibold text-2xl mb-4 text-blue-300">Security</h2>

      <div className="">
        <div className="flex flex-row justify-between text-xl">
          Update your password securely using this button
          <button
            onClick={() => {
              setIsUpdatePasswordFormOpen(true);
            }}
            className="rounded-3xl px-3 py-1 bg-[#2b5285] border-[1px] border-[#396296] cursor-pointer ml-4 text-lg"
          >
            Update Password
          </button>
        </div>
      </div>

      {isUpdatePasswordFormOpen ? (
        <PasswordUpdateForm
          setIsUpdatePasswordFormOpen={setIsUpdatePasswordFormOpen}
          password={newPassword}
          setPassword={setNewPassword}
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          notify={notify}
        ></PasswordUpdateForm>
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

export default Security;
