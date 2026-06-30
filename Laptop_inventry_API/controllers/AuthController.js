// write all the auth functions over here

const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model, models } = require("mongoose");
const { emit, findOne, base } = require("../models/LaptopModel");

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

  if (!updatedPassword || updatedPassword.length == 0) {
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

  if (isCurrentPasswordCorrect == false) {
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

// Sign in with google
const signinWithGoogle = async (req, res) => {
  const baseURL = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  const client_id = process.env.GOOGLE_CLIENT_ID;
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI;
  const response_type = "code";
  const scope = "openid email profile"; // we want permission to use this info from google
  const state = "Some Random String 123"; // todo: make random string + verify on callback
  const access_type = "offline";

  baseURL.searchParams.set("client_id", client_id);
  baseURL.searchParams.set("redirect_uri", redirect_uri);
  baseURL.searchParams.set("response_type", response_type);
  baseURL.searchParams.set("scope", scope);
  baseURL.searchParams.set("state", state);
  baseURL.searchParams.set("access_type", access_type);

  return res.redirect(baseURL.toString());
  // final string  = http://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=...&scope=...&state=...&access_type=...
};

// handle google callback
const handleGoogleCallback = async (req, res) => {
  // the above redirect url will give us this 'state' and 'code'.
  const state = req.query.state; // todo: Verify state matches what you sent (CSRF guard)
  const code = req.query.code;

  const client_id = process.env.GOOGLE_CLIENT_ID;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET;
  const redirect_uri = process.env.GOOGLE_REDIRECT_URI;

  // asking google to give us the 'access_token' and 'id_token'
  const responseObj = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code: code,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
  });

  const data = await responseObj.json();
  console.log("google return data: ", data);

  const id_token_data = jwt.decode(data.id_token);
  console.log(id_token_data); // name , email , googleId

  // find or create the user into our DB

  const user = await User.findOne({ email: id_token_data.email });

  if (user) {
    // if user is found , just return the token.

    const user = await User.findOne({email:id_token_data.email});

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.redirect(
      process.env.CLIENT_URL + "/auth/callback?token=" + token,
    );

  } else {
    // create a new account for the user , expected return a mongoose doc with user info.
    const newUser = await User.create({
      name: id_token_data.name,
      email: id_token_data.email,
      googleId: id_token_data.googleId,
    });

    // give the frontend jwt
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // redirect to forntend , because no one is doing a fetch call on this api , so we need to give the token in the form of url
    // a frontend react page that handles this login flow
    return res.redirect(
      process.env.CLIENT_URL + "/auth/callback?token=" + token,
    );
  }
};

module.exports = {
  signup,
  signin,
  userEmail,
  getUserInfo,
  updateName,
  updatePassword,
  signinWithGoogle,
  handleGoogleCallback,
};
