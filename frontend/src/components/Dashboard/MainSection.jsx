import React, { useContext, useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { FiDelete } from "react-icons/fi";
import EditForm from "./EditForm";
import Notification from "../CommonComponents/Notification";
import AddForm from "./AddForm";
import DeleteConfirmation from "./DeleteConfirmation";
import { GrFormNextLink } from "react-icons/gr";
import { GrFormPreviousLink } from "react-icons/gr";
import { Oval } from "react-loader-spinner";
import { LaptopContext } from "../../context/LaptopDataContext";

const MainSection = () => {
  const {getLaptopDataForStats} = useContext(LaptopContext);
  const [laptopData, setLaptopData] = useState([]);
  const [ServerMsg, setServerMsg] = useState();
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit states
  const [isEditFromOpen, setIsEditFormOpen] = useState(false);
  const [laptopID, setLaptopID] = useState();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [ram, setRam] = useState(0);
  const [storage, setStorage] = useState(0);

  // Add states
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [Addname, setAddName] = useState("");
  const [Addbrand, setAddBrand] = useState("");
  const [Addprice, setAddPrice] = useState("");
  const [Addram, setAddRam] = useState(0);
  const [Addstorage, setAddStorage] = useState(0);

  // Delete State
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  // Empty state
  const [isEmpty, setIsEmpty] = useState(false);

  // loading State
  const [isLoading, setIsLoading] = useState(false);

  // error states
  const [isFailedToFetchData, setIsFailedToFetchData] = useState(false);

  // notification state
  const [showNotification, setShowNotification] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // central notification trigger — lives here so it survives the EditForm closing
  const notify = (data, isErr) => {
    setServerMsg(data.message || data.error || data.err || "");
    setIsError(isErr);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);

    // on a successful operation, refetch so the table reflects the new data
    if (!isErr) {
      getLaptopData();
      // call this fuction so that stats data can refresh again : probably a duplicate network call here , but optimisation for later.
      getLaptopDataForStats();
    }
  };

  // get all laptops data
  const getLaptopData = async () => {
    setIsLoading(true);
    const responseObject = await fetch(
      `${BASE_URL}/api/laptops?page=${page}&limit=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      },
    );

    if (responseObject.ok) {
      setIsFailedToFetchData(false);
      const data = await responseObject.json();

      console.log(data);
      setIsLoading(false);

      if (data.stats.totalLaptops == 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }

      setLaptopData(data.laptopData);
      setTotalPages(data.pagination.totalPages);
    } else {
      setIsLoading(false);
      setIsFailedToFetchData(true);
    }
  };

  // delete laptop
  const deleteLaptop = async (id) => {
    const responseObject = await fetch(`${BASE_URL}/api/deletelaptop/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await responseObject.json();

    console.log(data);

    notify(data, !responseObject.ok);

    setIsDeleteConfirmationOpen(false);
  };

  // go to next page
  const getNextPage = () => {
    setPage((p) => {
      return p + 1;
    });
  };

  // go to previous page
  const getPreviousPage = () => {
    setPage((p) => {
      return p - 1;
    });
  };

  useEffect(() => {
    getLaptopData();
  }, [page]);

  return (
    <div className="flex-1 flex flex-col bg-[#272727] border-[0.8px] border-[#3d3d3d] rounded-4xl m-2 min-h-0">
      {/* Add button */}
      <div className="flex justify-between px-4 mt-4">
        <div className="bg-[#212121] flex-1 mr-4 rounded-xl"></div>
        <button
          className="bg-[#22943b] border border-[#3fb058] border-[0.8px] px-4 py-1 rounded-xl cursor-pointer"
          onClick={() => {
            setIsAddFormOpen(true);
          }}
        >
          + Add
        </button>
      </div>
      {/* table wrapper for rounded corners */}
      <div className="mt-4 mx-2 rounded-4xl overflow-y-auto border border-[#333] flex-1 min-h-0 scrollbar-thumb-[#575757]">
        {isLoading || isFailedToFetchData || isEmpty ? (
          <div className="flex flex-col justify-center items-center bg-[#494949] mt-10 w-[95%] mx-auto py-10 rounded-3xl text-center">
            {isEmpty ? (
              <>
                <span className="text-3xl mb-2">💻</span>
                <span className="font-medium">No laptops yet</span>
                <span className="text-sm text-[#b0b0b0] mt-1">
                  Click “+ Add” to add your first laptop.
                </span>
                <button
                  className="bg-[#22943b] border border-[#3fb058] border-[0.8px] px-4 py-1 rounded-xl cursor-pointer"
                  onClick={() => {
                    setIsAddFormOpen(true);
                  }}
                >
                  + Add
                </button>
              </>
            ) : (
              <div className="flex justify-center items-center">
                {isFailedToFetchData ? (
                  "⚠️"
                ) : (
                  <Oval
                    height={24}
                    width={24}
                    color="#000"
                    secondaryColor="#888"
                    strokeWidth={4}
                    visible={true}
                    ariaLabel="oval-loading"
                  />
                )}
                <span className="ml-4">
                  {isFailedToFetchData
                    ? "Some Error occured, plese try again!"
                    : "Loading your data..."}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* laptop data table */}
            <table className="w-full text-left border-collapse">
              {/* table head */}
              <thead className="sticky top-0">
                <tr className="bg-[#464646]">
                  <th className="px-4 py-3 ">Sr.no</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Ram</th>
                  <th className="px-4 py-3">Storage</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              {/* table body */}
              <tbody className="p-2">
                {laptopData.map((laptop, i) => (
                  <tr
                    className=" border-b border-[#333] hover:bg-[#2f2f2f] transition-colors"
                    key={laptop._id}
                  >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3">
                      {laptop.name ? laptop.name : ""}
                    </td>
                    <td className="px-4 py-3">
                      {laptop.brand ? laptop.brand : ""}
                    </td>
                    <td className="px-4 py-3">
                      {laptop.specs?.ram ? laptop.specs.ram : ""}
                    </td>
                    <td className="px-4 py-3">
                      {laptop.specs?.Storage ? laptop.specs.Storage : ""}
                    </td>
                    <td className="px-4 py-3">
                      ${laptop.price ? laptop.price : ""}
                    </td>
                    <td className="px-4 py-3 flex flex-row justify-evenly">
                      <button
                        className="bg-[#266ea1] p-2 rounded-lg cursor-pointer mr-2"
                        onClick={(e) => {
                          setLaptopID(laptop._id);
                          setName(laptop.name);
                          setBrand(laptop.brand);
                          setRam(laptop.specs.ram);
                          setStorage(laptop.specs.Storage);
                          setPrice(laptop.price);

                          // open the Edit form
                          setIsEditFormOpen(true);
                        }}
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        className="bg-[#aa2d17] p-2 rounded-lg cursor-pointer"
                        onClick={() => {
                          setLaptopID(laptop._id);

                          // open the delete confirmation dialog box
                          setIsDeleteConfirmationOpen(true);
                        }}
                      >
                        <FiDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {totalPages <= 1 ? (
          ""
        ) : (
          <div className="flex flex-row justify-center my-2 items-center">
            <button
              onClick={getPreviousPage}
              className="bg-[#464646] px-4 py-1 rounded-xl mx-3 cursor-pointer flex flex-row items-center text-nowrap"
            >
              <GrFormPreviousLink className="text-2xl" /> Previous page
            </button>
            <span className="text-nowrap">
              {page} / {totalPages}
            </span>
            <button
              onClick={getNextPage}
              className="bg-[#464646] px-4 py-1 rounded-xl mx-3 cursor-pointer flex flex-row items-center text-nowrap"
            >
              Next page <GrFormNextLink className="text-2xl" />
            </button>
          </div>
        )}
      </div>

      {showNotification ? (
        <Notification
          message={ServerMsg}
          backgroundColor={isError ? "bg-red-400" : "bg-green-400"}
        ></Notification>
      ) : (
        ""
      )}

      {isEditFromOpen ? (
        <EditForm
          setIsEditFormOpen={setIsEditFormOpen}
          notify={notify}
          laptopID={laptopID}
          myname={name}
          mybrand={brand}
          myram={ram}
          mystorage={storage}
          myprice={price}
        ></EditForm>
      ) : (
        ""
      )}

      {isAddFormOpen ? (
        <AddForm
          setIsAddFormOpen={setIsAddFormOpen}
          notify={notify}
          myname={Addname}
          mybrand={Addbrand}
          myram={Addram}
          mystorage={Addstorage}
          myprice={Addprice}
          setAddName={setAddName}
          setAddBrand={setAddBrand}
          setAddPrice={setAddPrice}
          setAddRam={setAddRam}
          setAddStorage={setAddStorage}
        ></AddForm>
      ) : (
        ""
      )}

      {isDeleteConfirmationOpen ? (
        <DeleteConfirmation
          setIsDeleteConfirmationOpen={setIsDeleteConfirmationOpen}
          laptopID={laptopID}
          deleteLaptop={deleteLaptop}
        ></DeleteConfirmation>
      ) : (
        ""
      )}
    </div>
  );
};

export default MainSection;
