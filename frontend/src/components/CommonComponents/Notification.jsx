import React from "react";

const Notification = ({ message, backgroundColor }) => {
  return (
    <div
      className={
        backgroundColor +
        " fixed bottom-7 right-7 w-[300px] min-h-[60px] rounded-2xl flex items-center px-4 text-black font-medium shadow-lg z-50"
      }
    >
      {message}
    </div>
  );
};

export default Notification;
