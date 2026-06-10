const express = require("express");
const router = express.Router();
const { checkJWTtoken } = require("../middleware/CommonMiddleware.js");
const {
  getAllLaptops,
  addLaptop,
  deleteLaptop,
  updateLaptop,
} = require("../controllers/LaptopController");

// middleware to check for jwt token , which means the user is a vlaid system user
// All laptop routes should only be accessible for logged in users
router.use(checkJWTtoken);

router.get("/laptops", getAllLaptops);

router.post("/addlaptop", addLaptop);

router.delete("/deletelaptop/:id", deleteLaptop);

router.put("/updatelaptop/:id", updateLaptop);

module.exports = router;
