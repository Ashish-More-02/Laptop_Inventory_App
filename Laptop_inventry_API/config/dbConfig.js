const mongoose = require("mongoose");

// localhost connection string
const MONGO_DB_CONNECTION_URL = process.env.MONGO_DB_CONNECTION_URL;
// Cloud connection string
const MONGO_DB_CLOUD_CONNECTION_URL = process.env.MONGO_DB_CLOUD_CONNECTION_URL;

function connectDB() {
  // connecting to mongodb with a new project and cluster
  mongoose
    .connect(MONGO_DB_CLOUD_CONNECTION_URL)
    .then(() => {
      console.log("mongodb connected successfully!");
    })
    .catch((err) => {
      console.log("error in mongodb connection" + err);
    });
}

module.exports = {connectDB};