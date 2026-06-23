const express = require("express");
const { signup, signin ,userEmail,getUserInfo} = require("../controllers/AuthController");
const { checkJWTtoken } = require("../middleware/CommonMiddleware");
const router = express.Router();


router.post("/signup",signup);
router.post("/signin",signin);
router.post("/getuseremail",userEmail);

// protected route with middleware.
router.get("/me",checkJWTtoken,getUserInfo);

module.exports = router;