import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSignInPage = () => {
  const navigate = useNavigate();

  const handleCallback = () => {
    const url = window.location.href;

    // catches all the query parameters
    const urlParams = new URLSearchParams(window.location.search);

    if (!urlParams) {
      return;
    }

    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div>
      <form className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-10 relative z-20">
        <div className="flex flex-row justify-between">
          <h1 className="font-bold text-xl">Laptop Inventory App</h1>
        </div>

        <p className="text-[#888888]">
          Please wait, Redirecting you to your dashboard...
        </p>
      </form>
    </div>
  );
};

export default GoogleSignInPage;
