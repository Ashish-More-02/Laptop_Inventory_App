import { createContext, useEffect, useState } from "react";

export const LaptopContext = createContext();

export function LaptopDataProvider({ children }) {
  const [laptopData, setLaptopData] = useState("");
  const [FullResponseFromServer ,setFullResponseFromServer] = useState("");

  // get all laptops data
  const getLaptopData = async () => {
    const responseObject = await fetch("http://localhost:3000/api/laptops", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await responseObject.json();

    setLaptopData(data.laptopData);

    setFullResponseFromServer(data);
  };

  useEffect(() => {
    getLaptopData();
  }, []);

  return (
    <LaptopContext.Provider value={{ laptopData ,FullResponseFromServer}}>
      {children}
    </LaptopContext.Provider>
  );
}
