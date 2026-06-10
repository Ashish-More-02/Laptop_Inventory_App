const Laptop = require("../models/LaptopModel");
const { User } = require("../models/UserModel");

// logic to get all laptops for that user
const getAllLaptops = async (req, res) => {
  // we are accessing userId from the request object cause the middleware added that to it.
  const userID = req.user.userId;

  console.log(userID);

  const laptopData = await Laptop.find({ createdBy: userID });

  console.log(laptopData);

  if (laptopData) {
    return res.status(200).json({ laptopData });
  } else {
    return res.status(500).json({
      error: "internal server error , while fetching all laptop data",
    });
  }
};

// post route for the signed in user to create a laptop
const addLaptop = async (req, res) => {
  // destructuring the values from the request object
  const { name, brand, price, specs } = req.body;

  let userName = await User.findOne({ _id: req.user.userId });

  userName = userName.name;

  // accessing the user id from the middleware ,as it put the userId into the 'user' object
  try {
    const laptopData = await Laptop.create({
      name: name,
      brand: brand,
      price: price,
      specs: specs,
      createdBy: req.user.userId,
    });
    console.log(laptopData);

    return res.status(200).json({
      message: "New laptop added successfully by " + userName,
      laptopData: laptopData,
    });
  } catch (err) {
    return res.status(500).json({
      error: "there is some error while creating a new laoptop" + err,
    });
  }
};

// delete laptop
const deleteLaptop = async (req, res) => {
  // we need to check if the user is logged in user
  const userid = req.user.userId;
  if (!userid) {
    return res.status(400).json({ err: "userid not found!" });
  }

  // get the laptop id to delete from the params
  const laptopid = req.params.id;
  if (!laptopid) {
    return res
      .status(400)
      .json({ err: "laptopid not found, deletion will fail " });
  }

  try {
    // actually delete the laptop now using findOneAndDelete() method of mongoose , and return appropriate response back
    const deletedLaptop = await Laptop.findOneAndDelete({
      _id: laptopid,
      createdBy: userid,
    });

    if (!deletedLaptop) {
      return res.status(404).json({ message: "laptop not found" });
    }

    return res
      .status(200)
      .json({ message: "laptop deleted successfully!", data: deletedLaptop });
  } catch (err) {
    return res.status(500).json({
      err: "deletion failed , error in performing operation of find and delete",
    });
  }
};

// update laptop
const updateLaptop = async (req, res) => {
  // get the user id
  const userId = req.user.userId;

  // get the data to update the document
  const dataToUpdate = req.body.data;

  if (!userId) {
    return res.status(400).json({ error: "user not found!" });
  }

  // get laptop id to update
  const laptopId = req.params.id;

  if (!laptopId) {
    return res.status(400).json({ error: "laptopid not found to update" });
  }

  try {
    const laptopUpdate = await Laptop.findOneAndUpdate(
      { _id: laptopId, createdBy: userId },
      dataToUpdate,{ new: true, runValidators: true }
    );

    if (!laptopUpdate) {
      return res.status(400).json({ error: "unable to update laptop" });
    }

    return res
      .status(200)
      .json({ message: "laptop updated successfully!", data: laptopUpdate });
  } catch (err) {
    return res.status(500).json({
      err: "updation failed , error in performing operation of find and update",
    });
  }
};

module.exports = {
  getAllLaptops,
  addLaptop,
  deleteLaptop,
  updateLaptop,
};




// 3 important functions to remember from this is : 

// create() -> create a new document in the collection
// find() -> a general find command which gets some data from teh collection
// findByIdAndDelete() -> a function to find by id and delete it
// findByIdAndUpdate() -> a function to find by id and update the document


// document is row in a table 
// collection is table in a databaes 
// database is database 