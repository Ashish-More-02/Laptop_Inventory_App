import { createContext, useEffect, useState } from "react";

export const LaptopContext = createContext();

export function LaptopDataProvider({ children }) {
  const [laptopData, setLaptopData] = useState("");
  const [FullResponseFromServer ,setFullResponseFromServer] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // get all laptops data
  const getLaptopData = async () => {
    const responseObject = await fetch(`${BASE_URL}/api/laptops`, {
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
    <LaptopContext.Provider value={{ laptopData ,FullResponseFromServer,getLaptopDataForStats:getLaptopData}}>
      {children}
    </LaptopContext.Provider>
  );
}
