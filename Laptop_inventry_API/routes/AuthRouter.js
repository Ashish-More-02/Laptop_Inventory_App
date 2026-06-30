const express = require("express");
const {
  signup,
  signin,
  userEmail,
  getUserInfo,
  updateName,
  updatePassword,
  signinWithGoogle,
  handleGoogleCallback
} = require("../controllers/AuthController");
const { checkJWTtoken } = require("../middleware/CommonMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/getuseremail", userEmail);

// singIn with google routes
router.get("/auth/google", signinWithGoogle);
router.get("/auth/google/callback",handleGoogleCallback);

// protected route with middleware.
router.use(checkJWTtoken);
router.get("/me", getUserInfo);
router.post("/updatename", updateName);
router.post("/updatepassword", updatePassword);

module.exports = router;
