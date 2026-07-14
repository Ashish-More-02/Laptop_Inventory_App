import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdLaptop } from "react-icons/md";
import googleIcon from "../assets/google-icon.png";
import { validateEmail, validatePassword } from "../utils/validators";
import { Oval } from "react-loader-spinner";
import { MdErrorOutline } from "react-icons/md";
import { FaRegCheckCircle } from "react-icons/fa";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [msgBackgrounColor, setMsgBackgroundColor] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleRegister = (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setEmailErrorMsg(emailError);
    setPasswordErrorMsg(passwordError);

    if (emailError || passwordError) {
      setIsError(true);
      setMsgBackgroundColor("bg-[rgb(201,86,62)]");
      setMessage("Invalid Email or Password , please try again");
      return;
    }

    setIsLoading(true);

    fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          // error state
          throw new Error("Registration failed, invlaid credentials");
        }
      })
      .then((data) => {
        // success state
        setIsLoading(false);
        setIsError(false);
        setMsgBackgroundColor("bg-[rgb(75,163,70)]"); // green
        setMessage("Account creation Successful!");
        setTimeout(() => {
          setIsLoading(false);
          navigate("/login");
        }, 1500);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        setMsgBackgroundColor("bg-[rgb(201,86,62)]"); // red
        setMessage("Registration failed, invlaid credentials");
        console.error(err.message);
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
      <div
        onClick={handleGoToHomepage}
        className="flex items-center justify-center gap-2 font-bold text-xl sm:text-3xl mt-4 cursor-pointer"
      >
        <MdLaptop className="sm:text-2xl" /> Laptop Inventory management
      </div>
      <form
        onSubmit={handleRegister}
        className="bg-[#1b1c1c] border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] rounded-3xl p-4 mx-auto mt-12 relative"
      >
        <h1 className="font-bold text-xl">Register to your account</h1>
        <p className="text-[#888888]">
          Enter your Details below to register your account to Laptop Inventory
          App
        </p>
        <div className="mt-10 flex-col justify-between">
          <label className="text-xl mr-4">Name</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={name}
            placeholder="Jhon Doe"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-4 flex-col justify-between">
          <label className="text-xl mr-4">Email</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type="text"
            value={email}
            placeholder="example@email.com"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => {
              setEmailErrorMsg(validateEmail(email));
            }}
          />
          {emailErrorMsg ? (
            <div className="text-red-400">{emailErrorMsg}</div>
          ) : (
            ""
          )}
        </div>

        <div className="mt-4 flex-col justify-between relative">
          <label className="text-xl mr-4">Password</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => {
              setPasswordErrorMsg(validatePassword(password));
            }}
          />
          <div
            className="absolute top-[45px] right-2.5"
            onClick={handleShowPassword}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
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
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Oval
                  height={24}
                  width={24}
                  color="#000"
                  secondaryColor="#888"
                  strokeWidth={4}
                  visible={true}
                  ariaLabel="oval-loading"
                />
                <span className="ml-2"> creating your account</span>
              </div>
            ) : (
              "Register"
            )}
          </button>
        </div>

        <div className="mt-4 flex justify-center items-center">
          <p className="">
            if you have alredy registerd, then please signin to continue{" "}
            <Link to="/login">
              <button className="text-blue-300 underline cursor-pointer">
                SignIn
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
        <div
          className={`${msgBackgrounColor} border-[0.8px] border-[#333333] w-[95%] sm:w-[450px] h-[80px] rounded-3xl p-4 mx-auto mt-4 flex items-center justify-center`}
        >
          {isError ? (
            <>
              <MdErrorOutline className="text-xl mr-2" />
              {message}
            </>
          ) : (
            <>
              <FaRegCheckCircle className="text-xl mr-2" />
              {message}
            </>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RegisterPage;
