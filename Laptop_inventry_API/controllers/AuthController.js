// write all the auth functions over here

const { User } = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { model, models } = require("mongoose");

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
  const user = await User.findOne({email: email});

  if (!user || user.length == 0) {
    return res.status(400).json({ error: "Invalid credentials, user not found" });
  }
  console.log(user);

  try {
    // compare password
    const compare = await bcrypt.compare(password, user.password);

    if(!compare){
      return res.status(401).json({error:"Invalid credentials"});
    }

    // user found now create a jwt and assing to user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    return res.status(400).json({error: "error in signing in !"});
  }
};

module.exports = {
  signup,
  signin,
};
