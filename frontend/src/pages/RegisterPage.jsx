import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdLaptop } from "react-icons/md";
import googleIcon from "../assets/google-icon.png";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(email);

    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setMessage("Invalid Email or Password , please try again");
      return;
    }

    fetch("http://localhost:3000/signup", {
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
          setMessage("Registration failed, invlaid credentials");
          throw new Error("Registration failed, invlaid credentials");
        }
      })
      .then((data) => {
        // success state
        setMessage("Registration Successful!");
        navigate("/login");
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  // check email , return true or false
  function validateEmail(email) {
    const emailRegex = /^\S+@\S+\.\S{2,3}$/;
    if (!emailRegex.test(email)) {
      // failed condition
      setEmailErrorMsg("Invalid email, please try again");
      return false;
    } else {
      setEmailErrorMsg("");
      return true;
    }
  }


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
            onBlur={()=>{
              validateEmail(email)
            }}
          />
          {emailErrorMsg? <div className="text-red-400">{emailErrorMsg}</div>:""}
        </div>

        <div className="mt-4 flex-col justify-between relative">
          <label className="text-xl mr-4">Password</label>
          <input
            className="bg-[#292929] w-full text-xl focus:outline-none rounded-xl p-2 border-[0.8px] border-[#333333] mt-1"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={()=>{
              validatePassword(password)
            }}
          />
          <div
            className="absolute top-[45px] right-2.5"
            onClick={handleShowPassword}
          >
            {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
          </div>
          {passwordErrorMsg? <div className="text-red-400">{passwordErrorMsg}</div>:""}
        </div>

        <div className="mt-10 flex items-center justify-center w-full ">
          <button
            className="w-full px-4 py-2 text-xl bg-[#b0b0b0] text-black rounded-xl cursor-pointer"
            type="submit"
          >
            Register
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
          href="http://localhost:3000/auth/google"
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

export default RegisterPage;
