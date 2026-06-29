const express = require("express");
const { signup, signin ,userEmail,getUserInfo,updateName,updatePassword} = require("../controllers/AuthController");
const { checkJWTtoken } = require("../middleware/CommonMiddleware");
const router = express.Router();


router.post("/signup",signup);
router.post("/signin",signin);
router.post("/getuseremail",userEmail);

// protected route with middleware.
router.use(checkJWTtoken);
router.get("/me",getUserInfo);
router.post("/updatename",updateName);
router.post("/updatepassword",updatePassword);

module.exports = router;