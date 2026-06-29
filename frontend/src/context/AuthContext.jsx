import React from "react";
import { useState, useEffect } from "react";
import { createContext } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // note do not use this same work repetatively else it causes errors.
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(
    !!localStorage.getItem("token"),
  );
  const [userEmail, setUserEmail] = useState();
  const [userData, setUserData] = useState();

  // using post method : unsafe
  const getUserEmail = async () => {
    const tokenPayload = JSON.parse(
      atob(localStorage.getItem("token").split(".")[1]),
    );
    const userID = tokenPayload.userId;
    console.log(userID);

    // message sent to backend.
    const ResponseObject = await fetch("http://localhost:3000/getuseremail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // issue here was i coverted the UserID data to json but the complete body object is still javascript, that is the issue.
      body: JSON.stringify({
        userID: userID,
      }),
    });

    // console.log(ResponseObject);

    const data = await ResponseObject.json();
    setUserEmail(data);
    console.log(data);
  };

  // using get method safe
  const getUserData = async () => {
    if (!localStorage.getItem("token")) {
      return;
    } else {
      const responseObj = await fetch("http://localhost:3000/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await responseObj.json();

      console.log(data);
      setUserData(data);
    }
  };

  useEffect(() => {
    // getUserEmail();
    getUserData();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsUserLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        isUserLoggedIn,
        login,
        logout,
        refreshUserData: getUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
