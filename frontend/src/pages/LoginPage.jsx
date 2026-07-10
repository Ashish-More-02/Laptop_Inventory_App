import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { MdLaptop } from "react-icons/md";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import googleIcon from "../assets/google-icon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  // we are creating a callback function here.
  const navigate = useNavigate();

  // this is a React component which needs to be returned from a function to work
  // <Navigate to="/dashboard"></Navigate>

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSignIn = (e) => {
    e.preventDefault();

    fetch(`${BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        } else {
          // the err is now a valid js object , so we need to handle it properly
          const err = await res.json();
          // when we throw an error object, the catch error have a property called as message which needs to be accessed to get the Error message that we have passed there
          throw new Error(`Login Failed : ${err.error}`);
        }
      })
      .then((data) => {
        // localStorage.setItem("token", data.token);
        login(data.token);
        // success message after the token is stored in localstorage
        setMessage("Login Successful!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error(err.message);
        // error message
        setMessage("Login Failed, please try again");
      });
  };

  const handleShowPassword = (e) => {
    e.preventDefault();

    setShowPassword(!showPassword);
  };

  const handleGoToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <h1
        onClick={handleGoToHomepage}
        className="flex items-center justify-center gap-2 font-bold text-xl sm:text-3xl mt-4 cursor-pointer"
      >
        <MdLaptop className="sm:text-2xl" /> Laptop Inventory management
      </h1>
      <form
        onSubmit={handleSignIn}
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-20 relative"
      >
        <h1 className="font-bold text-xl">Login to your account</h1>
        <p className="text-[#888888]">
          Enter your Details below to login your account in Laptop Inventory App
        </p>

        <div className="mt-10 flex flex-col justify-between">
          <label className="text-xl mr-4">Email</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={email}
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-col justify-between relative">
          <label className="text-xl mr-4">Password</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute bottom-[14px] right-2.5"
            onClick={handleShowPassword}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center w-full ">
          <button
            className="w-full px-4 py-2 text-xl bg-[#b0b0b0] text-black rounded-xl cursor-pointer"
            type="submit"
          >
            Login
          </button>
        </div>

        <div className="mt-4 flex justify-center items-center">
          <p className="mr-2">
            if you have not alredy registerd, then please register to continue{" "}
            <Link to="/register">
              <button className="text-blue-300 underline cursor-pointer">
                Register
              </button>
            </Link>
          </p>
        </div>

        <div className="flex flex-row justify-center items-center mt-4">
          <hr className="text-[#484848] w-full" />
          <span className="mx-2">OR</span>
          <hr className="text-[#484848] w-full" />
        </div>

        <a
          href={`${BASE_URL}/auth/google`}
          className="flex flex-row justify-center items-center mt-4 w-full px-4 py-2 text-xl bg-[#121212] rounded-xl cursor-pointer"
        >
          <img className="h-6 mr-2" src={googleIcon} alt="Google logo" />
          <span className="text-white text-lg">Sign in with Google</span>
        </a>
      </form>

      {message ? (
        <div className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] h-[80px] rounded-3xl p-4 mx-auto mt-4">
          {message}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default LoginPage;
