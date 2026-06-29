// write all the auth functions over here

const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model, models } = require("mongoose");
const { emit, findOne } = require("../models/LaptopModel");

// User will register for the first time.
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // applying some checks : if any value does not exist return error
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email or password missing , please try again!" });
  }

  // this parameter determines how many times does the hashing algorithm runs (2ˆ rounds)
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const OneUser = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });

  return res
    .status(200)
    .json({ message: "User created successfully!", user: OneUser });
};

// check if user exists ,if yes then create jwt token and assign to user
const signin = async (req, res) => {
  const { email, password } = req.body;

  // find() function will return a array [{use1}, {user2},...] , if only one exists then [{user1}] or if empty []
  // const user = await User.find({ email: email });

  // so we have to use findOne() function here , which will only return a document ( js object or null)
  const user = await User.findOne({ email: email });

  if (!user || user.length == 0) {
    return res
      .status(400)
      .json({ error: "Invalid credentials, user not found" });
  }
  console.log(user);

  try {
    // compare password
    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // user found now create a jwt and assing to user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    return res.status(400).json({ error: "error in signing in !" });
  }
};

// NOTE : this have a major security flaw , that it is publically available and anyone can send a token to get anyusers info
const userEmail = async (req, res) => {
  const { userID } = req.body;

  const user = await User.findById(userID);

  if (!user) {
    return res.status(400).json({ error: "user not found by userId" });
  } else {
    console.log(user);
    return res.status(200).json({ email: user.email, role: user.role });
  }
};

const getUserInfo = async (req, res) => {
  // getting data from the middleware
  const userID = req.user.userId;

  const userData = await User.findById(userID);

  if (!userData) {
    return res
      .status(400)
      .json({ error: "User data not found or does not exists!" });
  } else {
    return res.status(200).json({
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
  }
};

const updateName = async (req, res) => {
  const updatedName = req.body.name;

  if (!updatedName) {
    return res.status(400).json({
      error: "Please enter a new updated name, it should not be empty!",
    });
  }

  // data from middleWare
  const userId = req.user.userId;

  const userData = await User.findOneAndUpdate(
    { _id: userId },
    { name: updatedName },
    { returnDocument: "after", runValidators: true },
  );

  if (!userData) {
    return res.status(500).json({
      error: "Could not find UserID , please try again with valid user data",
    });
  } else {
    return res.status(200).json({ message: "Name Updated successfully!" });
  }
};

const updatePassword = async (req, res) => {
  const updatedPassword = req.body.newPassword;
  const currentPassword = req.body.currentPassword;

  if (!updatedPassword || updatedPassword.length=="") {
    return res.status(400).json({
      error: "New password cannot be empty , please enter a valid password!",
    });
  }

  const userId = req.user.userId;

  const userData = await User.findOne({ _id: userId });

  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    userData.password,
  );

  if (isCurrentPasswordCorrect==false) {
    return res
      .status(400)
      .json({ error: "Current password does not match , please try again!" });
  }

  const hashedPassword = await bcrypt.hash(updatedPassword, 10);

  // update the password for the user

  const update = await User.findOneAndUpdate(
    { _id: userId },
    { password: hashedPassword },
    { runValidators: true, returnDocument: "after" },
  );

  if (!update) {
    return res
      .status(400)
      .json({ error: "Error while updating password, please try again!" });
  } else {
    return res.status(200).json({ message: "Password updated successfully!" });
  }
};

module.exports = {
  signup,
  signin,
  userEmail,
  getUserInfo,
  updateName,
  updatePassword
};
